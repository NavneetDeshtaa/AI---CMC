from typing import TypedDict, List, Dict, Optional
from langgraph.graph import StateGraph, END

from app.services.Risk.clause_comparison import compare_against_policy
from app.services.Risk.scoring import compute_risk_score
from app.services.Risk.explanation import generate_explanation


class RiskPipelineState(TypedDict):
    """
    The shared state object that flows through every node. Each node reads
    what it needs from here and returns updates that get merged back in --
    by the time the graph reaches END, this dict holds everything needed
    to build the RiskAssessment row.

    total=False fields are ones that start empty and get filled in by
    later nodes -- Python's TypedDict doesn't have a clean way to mark
    individual fields optional like this, so in practice we just make sure
    every node returns sensible defaults and never assumes a field is
    populated before the node that's responsible for it has run.
    """
    contract_id: str
    raw_text: str
    policy_rules: List[Dict]

    flagged_clauses: List[Dict]
    missing_clauses: List[Dict]

    risk_score: int
    risk_level: str

    explanation: str


def extraction_node(state: RiskPipelineState) -> dict:
    """
    Agent 1: 'Extraction.' No LLM call here -- raw_text and policy_rules
    are already loaded into the initial state by the orchestrator before
    the graph even starts running (they come straight from Phase 1/2 data
    and Step 1's seed table). This node exists mainly to make the pipeline
    stages explicit and inspectable -- LangGraph lets you log/trace each
    node's execution individually, which is genuinely useful once you're
    debugging why a specific contract got an odd score.
    """
    print(f"[risk pipeline] extraction: {len(state['raw_text'])} chars, {len(state['policy_rules'])} policy rules")
    return {}  # nothing to add -- state already has what this "agent" represents


def comparison_node(state: RiskPipelineState) -> dict:
    """Agent 2: LLM compares contract text against the policy baseline."""
    result = compare_against_policy(state["raw_text"], state["policy_rules"])
    return {
        "flagged_clauses": result.get("flagged_clauses", []),
        "missing_clauses": result.get("missing_clauses", []),
    }


def scoring_node(state: RiskPipelineState) -> dict:
    """Agent 3: deterministic scoring over agent 2's findings."""
    score, level = compute_risk_score(
        state["flagged_clauses"], state["missing_clauses"], state["policy_rules"]
    )
    return {"risk_score": score, "risk_level": level}


def explanation_node(state: RiskPipelineState) -> dict:
    """Agent 4: LLM narrates the findings in plain English."""
    text = generate_explanation(
        state["risk_score"], state["risk_level"], state["flagged_clauses"], state["missing_clauses"]
    )
    return {"explanation": text}


def build_risk_graph():
    """
    Wires the four nodes into a linear graph: extraction -> comparison ->
    scoring -> explanation -> END. StateGraph(RiskPipelineState) tells
    LangGraph what shape of state to expect flowing through every node.
    """
    graph = StateGraph(RiskPipelineState)

    graph.add_node("extraction", extraction_node)
    graph.add_node("comparison", comparison_node)
    graph.add_node("scoring", scoring_node)
    graph.add_node("explanation", explanation_node)

    graph.set_entry_point("extraction")
    graph.add_edge("extraction", "comparison")
    graph.add_edge("comparison", "scoring")
    graph.add_edge("scoring", "explanation")
    graph.add_edge("explanation", END)

    # .compile() turns the graph definition into something actually
    # runnable via .invoke(initial_state) -- similar spirit to how
    # SQLAlchemy's query building is separate from actually executing it.
    return graph.compile()


# Built once at import time and reused -- same "expensive setup, reuse
# across requests" idea as your embedding model singleton, though graph
# compilation is much cheaper than loading a neural network.
risk_graph = build_risk_graph()
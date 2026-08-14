from typing import List, Dict, Tuple
import numpy as np
from sklearn.preprocessing import MinMaxScaler

SEVERITY_MULTIPLIER = {"high": 1.0, "medium": 0.6, "low": 0.3}


def compute_risk_score(
    flagged_clauses: List[Dict],
    missing_clauses: List[Dict],
    policy_rules: List[Dict],
) -> Tuple[int, str]:
    """
    Deterministic (no LLM) risk scoring. This runs AFTER the clause
    comparison agent -- it just turns its findings into a number.

    Why deterministic: the same findings should always produce the same
    score. An LLM asked "give this a risk score" would be inconsistent
    run to run, which is exactly wrong for something meant to be
    comparable across contracts over time.

    Method: each policy rule has a risk_weight (set in Step 1's seed
    data). A missing required clause contributes its full weight. A
    flagged (present-but-risky) clause contributes weight * severity
    multiplier, since a present-but-imperfect clause is generally less
    severe than a completely absent one. We sum these, then use
    scikit-learn's MinMaxScaler to normalize against the worst-case
    possible score (every active rule fully violated) so the result is
    always a clean 0-100, regardless of how many policy rules exist.
    """
    rule_weights = {r["clause_name"]: r["risk_weight"] for r in policy_rules}
    max_possible = sum(rule_weights.values()) or 1  # avoid divide-by-zero if no rules

    raw_score = 0.0
    for item in missing_clauses:
        raw_score += rule_weights.get(item["clause"], 10)  # default weight if clause not in policy set

    for item in flagged_clauses:
        weight = rule_weights.get(item["clause"], 10)
        multiplier = SEVERITY_MULTIPLIER.get(item.get("severity", "medium"), 0.6)
        raw_score += weight * multiplier

    # MinMaxScaler expects a 2D array of samples -- here we're scaling a
    # single value against a known [0, max_possible] range, which is a bit
    # of a degenerate case for it, but it's the correct, standard tool for
    # "map this raw number onto a 0-1 range given known bounds," and keeps
    # the door open to batch-scoring many contracts' raw scores together
    # later if you ever want relative scoring across your whole portfolio.
    scaler = MinMaxScaler(feature_range=(0, 100))
    scaler.fit(np.array([[0], [max_possible]]))
    normalized = scaler.transform(np.array([[raw_score]]))[0][0]

    score = int(round(min(100, max(0, normalized))))

    if score < 30:
        level = "low"
    elif score < 60:
        level = "medium"
    else:
        level = "high"

    return score, level
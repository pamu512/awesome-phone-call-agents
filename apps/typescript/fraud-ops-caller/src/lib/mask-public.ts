import { maskE164 } from "./plan-view";
import type { FraudOpsCase, FraudOpsOutcome } from "./types";

const E164_IN_TEXT = /\+[1-9][0-9]{7,14}/g;
const TRANSCRIPT_CAP = 160;

export function redactPhones(text: string): string {
  return text.replace(E164_IN_TEXT, (match) => {
    try {
      return maskE164(match);
    } catch {
      return "+********";
    }
  });
}

export function maskOutcomeForBrowser(outcome: FraudOpsOutcome): FraudOpsOutcome {
  const transcript = redactPhones(outcome.transcript_snippet);
  return {
    ...outcome,
    quotes: outcome.quotes.map(redactPhones),
    next_action: redactPhones(outcome.next_action),
    transcript_snippet:
      transcript.length > TRANSCRIPT_CAP
        ? `${transcript.slice(0, TRANSCRIPT_CAP)}…[redacted]`
        : transcript,
    fields: { ...outcome.fields },
  };
}

export function toPublicCase(fraudCase: FraudOpsCase): FraudOpsCase {
  return {
    ...fraudCase,
    contact: {
      ...fraudCase.contact,
      phone_e164: maskE164(fraudCase.contact.phone_e164),
    },
  };
}

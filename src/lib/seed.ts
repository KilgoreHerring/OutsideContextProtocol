import { getExercise, saveExercise } from './storage/exercises'
import type { Exercise } from '@/types/exercise'

const GREENLEAF_ID = 'greenleaf-tcs-redraft'
const SPA_DISCLOSURE_ID = 'spa-disclosure-letter'
const WITNESS_ID = 'witness-statement-drafting'
const LBA_ID = 'letter-before-action'

const GL_DOC_IDS = {
  clientEmail: 'doc-client-instruction-email',
  v1Terms: 'doc-v1-terms-and-conditions',
  v2Terms: 'doc-v2-terms-ideal',
  idealEmail: 'doc-ideal-response-email',
}

const SPA_DOC_IDS = {
  backgroundPack: 'doc-spa-client-background-pack',
  warrantiesSchedule: 'doc-spa-warranties-schedule',
  idealDisclosureLetter: 'doc-spa-ideal-disclosure-letter',
  idealMemo: 'doc-spa-ideal-internal-memo',
}

const WS_DOC_IDS = {
  caseSummary: 'doc-ws-case-summary',
  instructionEmail: 'doc-ws-instruction-email',
  witnessTranscript: 'doc-ws-witness-transcript',
  supportingDocs: 'doc-ws-supporting-documents',
  idealStatement: 'doc-ws-ideal-witness-statement',
  idealMemo: 'doc-ws-ideal-covering-memo',
  feedbackTemplate: 'doc-ws-supervisor-feedback-template',
}

const LBA_DOC_IDS = {
  clientInstruction: 'doc-lba-client-instruction-email',
  otherSideLba: 'doc-lba-other-side-letter',
  contract: 'doc-lba-contract',
  idealLba: 'doc-lba-ideal-letter-before-action',
  idealAdvice: 'doc-lba-ideal-advice-note',
}

async function seedExercise(id: string, buildExercise: () => Exercise): Promise<void> {
  const existing = await getExercise(id)
  if (existing) return
  const exercise = buildExercise()
  await saveExercise(exercise)
}

export async function seedDefaultExercise(): Promise<void> {
  await Promise.all([
    seedExercise(GREENLEAF_ID, buildGreenleafExercise),
    seedExercise(SPA_DISCLOSURE_ID, buildSpaDisclosureExercise),
    seedExercise(WITNESS_ID, buildWitnessStatementExercise),
    seedExercise(LBA_ID, buildLbaExercise),
  ])
}

function buildGreenleafExercise(): Exercise {
  const now = new Date().toISOString()

  const exercise: Exercise = {
    id: GREENLEAF_ID,
    title: 'Website T&Cs Redraft',
    description: 'Update consumer-facing website terms and conditions for GreenLeaf Home & Garden Ltd. The T&Cs have not been reviewed since 2016 and contain several issues including pre-GDPR data protection clauses, incorrect consumer cancellation rights, and no mention of a subscription service launched in 2022.',
    matterType: 'Commercial — Consumer-Facing T&Cs Redraft',
    difficulty: 'junior',
    estimatedDurationMinutes: 360,
    documents: [
      {
        id: GL_DOC_IDS.clientEmail,
        exerciseId: EXERCISE_ID,
        filename: 'client_instruction_email.md',
        mimeType: 'text/markdown',
        role: 'instruction',
        label: 'Client Instruction Email',
        extractedText: CLIENT_EMAIL_TEXT,
        uploadedAt: now,
      },
      {
        id: GL_DOC_IDS.v1Terms,
        exerciseId: EXERCISE_ID,
        filename: 'v1_terms_and_conditions.md',
        mimeType: 'text/markdown',
        role: 'source-material',
        label: 'Original Terms and Conditions (Version 1 — March 2016)',
        extractedText: V1_TERMS_TEXT,
        uploadedAt: now,
      },
      {
        id: GL_DOC_IDS.v2Terms,
        exerciseId: EXERCISE_ID,
        filename: 'v2_terms_and_conditions_ideal.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Updated Terms and Conditions (Version 2)',
        extractedText: V2_TERMS_TEXT,
        uploadedAt: now,
      },
      {
        id: GL_DOC_IDS.idealEmail,
        exerciseId: EXERCISE_ID,
        filename: 'ideal_response_email_to_client.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Covering Email to Client',
        extractedText: IDEAL_EMAIL_TEXT,
        uploadedAt: now,
      },
    ],
    steps: [
      {
        id: 'step-1',
        order: 1,
        title: 'Review Your Instructions',
        instruction: `You are a trainee solicitor at a commercial law firm. You have received an instruction email from the client, Sarah Mitchell (Managing Director of GreenLeaf Home & Garden Ltd), along with the company's current website terms and conditions.

**Your task:** Read both documents carefully. Take note of:
- What the client has specifically asked for
- The deadline and expected deliverables
- Any areas where the client has given you discretion

When you are ready, mark this step as complete and proceed to the next step. You may ask questions at any time using the chat — treat the chat as your supervising partner, James Harrington.`,
        type: 'read',
        visibleDocuments: [GL_DOC_IDS.clientEmail, GL_DOC_IDS.v1Terms],
        idealOutput: null,
        gradingCriteria: [],
        maxScore: 0,
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Identify Key Legal Issues',
        instruction: `Before you begin drafting, review the existing terms and conditions and identify the key legal issues that need to be addressed.

**Your task:** List all the legal issues, compliance gaps, and problems you can identify in the current Version 1 terms. For each issue, briefly explain:
1. What the problem is
2. Which legislation or regulation is relevant
3. What needs to change

Be thorough — a good trainee should spot issues beyond just what the client has explicitly mentioned.`,
        type: 'identify',
        visibleDocuments: [GL_DOC_IDS.clientEmail, GL_DOC_IDS.v1Terms],
        idealOutput: `Key legal issues identified in the Version 1 Terms and Conditions:

1. **Cancellation period is wrong (Section 6)** — States 7 days; must be 14 days under the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013 for distance selling.

2. **Refund period is non-compliant (Section 6.4)** — States 30 days; must be 14 days under the Consumer Contracts Regulations 2013.

3. **Data protection clause is non-compliant (Section 9)** — Pre-dates UK GDPR and Data Protection Act 2018. No lawful basis stated for processing. Incorrectly states data may be shared with third parties for marketing (client confirms this was never their practice). No reference to data subject rights. Consent model is inadequate.

4. **No cookie compliance** — No mention of cookies, consent requirements, or cookie policy. The Privacy and Electronic Communications Regulations 2003 (PECR) require informed consent for non-essential cookies.

5. **No subscription service terms** — The GreenLeaf Box monthly subscription (launched 2022) has no contractual terms. Must include pricing (£24.99/month), billing cycle, cancellation mechanism (14 days' notice), and statutory cooling-off rights for the first box.

6. **No ADR clause** — The Alternative Dispute Resolution for Consumer Disputes (Competent Authorities and Information) Regulations 2015 require traders to inform consumers about ADR, even if they do not commit to participating.

7. **Consumer Rights Act 2015 not reflected (Section 7)** — Basic warranty section does not reflect CRA 2015 tiered remedies: 30-day right to reject, 6-month repair/replace right, and 6-year longstop.

8. **Limitation of liability too broad (Section 8)** — Does not carve out death/personal injury, fraud, or statutory rights. These exclusions are unenforceable and including them without carve-outs is bad practice.

9. **No force majeure clause** — Should be included given recent supply chain disruption risks.

10. **Missing contact details and regulatory information** — E-Commerce Regulations 2002 require traders to provide email address, geographic address, and VAT registration number. Current terms lack email, phone, and VAT number.

11. **No model cancellation form** — Required to be provided to consumers by the Consumer Contracts Regulations 2013.

12. **Governing law clause incomplete (Section 11)** — Should note that consumers in Scotland or Northern Ireland may have the right to bring proceedings in their local courts.`,
        gradingCriteria: [
          'Identifies incorrect 7-day cancellation period (should be 14 days under Consumer Contracts Regs 2013)',
          'Identifies non-compliant data protection provisions (pre-GDPR, no lawful basis, incorrect third-party sharing claim)',
          'Identifies absence of cookie compliance (PECR 2003)',
          'Identifies missing subscription service terms for The GreenLeaf Box',
          'Identifies absence of ADR clause (ADR Regulations 2015)',
          'Identifies that Consumer Rights Act 2015 tiered remedies are not reflected',
          'Identifies overly broad limitation of liability without required carve-outs',
          'Identifies missing regulatory information (contact details, VAT number under E-Commerce Regs 2002)',
          'Identifies missing model cancellation form',
          'Identifies incorrect refund timeframe (30 days should be 14 days)',
          'Identifies need for force majeure clause',
          'Identifies incomplete governing law clause re: Scottish/NI consumers',
        ],
        maxScore: 15,
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Draft Updated Terms and Conditions',
        instruction: `Now draft the updated Terms and Conditions for GreenLeaf Home & Garden Ltd.

**Your task:** Produce a complete, updated set of terms and conditions that:
- Addresses all the issues you identified in the previous step
- Complies with current legislation (Consumer Rights Act 2015, Consumer Contracts Regulations 2013, UK GDPR, Data Protection Act 2018, PECR 2003, ADR Regulations 2015, E-Commerce Regulations 2002)
- Incorporates the client's specific instructions (subscription service, 30-day extended returns, ADR clause, data protection correction)
- Is written in clear, accessible language appropriate for a consumer audience
- Is well-structured with logical numbering

Take your time with this — it is the main deliverable. You may continue to ask questions via the chat if needed.`,
        type: 'draft',
        visibleDocuments: [GL_DOC_IDS.clientEmail, GL_DOC_IDS.v1Terms],
        idealOutput: V2_TERMS_TEXT,
        gradingCriteria: [
          'Data protection compliance: UK GDPR/DPA 2018 reference; lawful basis; removed third-party marketing sharing; explicit consent for marketing; data subject rights; reference to privacy policy',
          'Cookie compliance: PECR 2003; essential vs non-essential cookies; consent mechanism; reference to cookie policy',
          'Consumer cancellation rights: 14-day cooling-off period (not 7 days); model cancellation form; correct 14-day refund timeframe; exceptions listed',
          'Extended returns policy: 30-day policy as instructed; clearly separate from statutory rights; conditions (unused, original packaging)',
          'Faulty goods / CRA 2015: Tiered remedies (30 days full refund, 6 months repair/replace, 6 years longstop)',
          'Subscription service: GreenLeaf Box terms; pricing £24.99/month; cancellation with 14 days notice; rolling monthly; cooling-off for first box; price variation with 30 days notice',
          'ADR clause: Complaints process; ADR reference; compliant with ADR Regulations 2015',
          'Limitation of liability: Proper carve-outs for death/personal injury and fraud; not excluding statutory rights; force majeure provision',
          'Contact details and regulatory info: Email, phone, postal address, VAT number per E-Commerce Regulations 2002',
          'Governing law: England and Wales with note about Scottish/NI consumer jurisdiction',
          'Clear structure, accurate legal references, appropriate consumer-friendly language throughout',
        ],
        maxScore: 60,
      },
      {
        id: 'step-4',
        order: 4,
        title: 'Draft Covering Email to Client',
        instruction: `Finally, draft the covering email to the client (Sarah Mitchell) to accompany your updated terms and conditions.

**Your task:** Write a professional email that:
- Is addressed to Sarah Mitchell and copies in your supervising partner, James Harrington
- Summarises the key changes you have made and explains *why* each change was necessary (the client is not a lawyer — explain in plain English)
- Groups the changes logically (e.g. by topic area)
- Identifies any practical next steps or recommendations
- Uses an appropriate professional tone for a client relationship

Remember: the client specifically asked for "a short email setting out what you have changed and why" — not a full advice letter. Keep it clear and focused.`,
        type: 'email',
        visibleDocuments: [GL_DOC_IDS.clientEmail, GL_DOC_IDS.v1Terms],
        idealOutput: IDEAL_EMAIL_TEXT,
        gradingCriteria: [
          'Professional tone and format: Appropriate salutation, clear structure, professional sign-off, CC to supervising partner',
          'Summary of data protection changes: Explains removal of third-party sharing clause, explains GDPR compliance updates, recommends standalone privacy policy',
          'Summary of consumer rights changes: Explains 14-day cancellation (not 7), explains CRA 2015 faulty goods rights, explains extended 30-day returns',
          'Summary of new sections: Explains subscription terms for The GreenLeaf Box, explains ADR clause and why it is needed',
          'Practical next steps: Asks client to confirm VAT number, recommends privacy/cookie policies, suggests web developer review, invites feedback',
          'Explains WHY changes were made (not just listing them) — client needs to understand the legal reasoning',
          'Appropriate register — plain English for a commercial client, not overly legalistic',
        ],
        maxScore: 25,
      },
    ],
    rubric: {
      exerciseId: EXERCISE_ID,
      overallApproach: 'The trainee should systematically review the existing terms against current legislation, identify all compliance gaps and issues (including those not explicitly flagged by the client), produce a comprehensive and legally compliant updated set of terms, and then clearly communicate the changes and reasoning to the client in a professional covering email. The approach should demonstrate both legal knowledge and practical commercial awareness.',
      keyIssues: [
        'Cancellation period must be updated from 7 days to 14 days (Consumer Contracts Regulations 2013)',
        'Data protection clauses must be overhauled for UK GDPR/DPA 2018 compliance — remove false third-party sharing claim',
        'Cookie compliance required under PECR 2003',
        'Subscription service (The GreenLeaf Box) terms must be added — pricing, billing, cancellation, cooling-off',
        'ADR clause required under ADR Regulations 2015',
        'Consumer Rights Act 2015 tiered remedies for faulty goods must be included',
        'Limitation of liability needs carve-outs for death/personal injury and fraud',
        'E-Commerce Regulations 2002 require full contact details and VAT number',
        'Model cancellation form required',
        'Refund timeframe must be 14 days not 30',
        'Force majeure clause should be included',
        'Governing law should note Scottish/NI consumer jurisdiction rights',
      ],
      criticalErrors: [
        'Retaining the 7-day cancellation period instead of updating to 14 days',
        'Retaining the clause allowing third-party data sharing for marketing',
        'No mention of UK GDPR or Data Protection Act 2018',
        'No subscription service section despite client instructions',
        'Excluding statutory consumer rights in limitation of liability without proper carve-outs',
        'Significant legal errors or misstatements of law',
      ],
      qualityMarkers: [
        'Identifies issues beyond what the client explicitly mentioned (shows independent legal analysis)',
        'Clear, well-structured drafting with logical section numbering',
        'Consumer-friendly language appropriate for a website audience',
        'Covering email explains the WHY behind changes, not just the WHAT',
        'Practical recommendations and next steps in the covering email',
        'Appropriate use of legal references without being overly technical',
        'Flags the VAT number placeholder and recommends standalone privacy/cookie policies',
      ],
      questionRelevanceGuidance: `Good questions for this exercise include: asking whether the client has a separate privacy policy (shows understanding of GDPR best practice), asking about the VAT registration number (attention to detail), asking whether the client wants to commit to ADR or just inform about it (shows understanding of the regulations), asking about specific product categories that might be exempt from returns (practical thinking).

Poor questions include: asking for information clearly stated in the instruction email (client name, deadline, company address), asking what GDPR is (should already know), asking whether the client needs terms at all (irrelevant), or asking for the answer directly.

Questions about the client's VAT number should be answered: "Good question. For the purposes of this exercise, use a placeholder and flag it to the client in your email."
Questions about a standalone privacy policy should be answered: "Excellent question. You don't need to draft one for this exercise, but you should recommend that the client has one and reference it in the T&Cs."`,
    },
    generatedMarkdown: EXERCISE_MARKDOWN,
    status: 'ready',
    createdAt: now,
    updatedAt: now,
  }

  return exercise
}

// --- Embedded Document Texts ---

const CLIENT_EMAIL_TEXT = `From: Sarah Mitchell, Managing Director — GreenLeaf Home & Garden Ltd
To: [Trainee Solicitor]
CC: James Harrington, Partner — [Your Firm]
Date: 10 February 2026
Subject: Update to Website Terms and Conditions — Urgent

Dear [Trainee],

Thank you for taking this on. James mentioned you would be handling the first draft of this for us.

We have not updated our website terms and conditions since March 2016 and I know a lot has changed since then, particularly around data protection. We have had a few customer complaints recently and our web developer has flagged that our terms are out of date, so we would like to get these refreshed as soon as possible.

Here is what we need specifically:

1. Data protection — We need to make sure we are fully compliant with current data protection legislation. We collect names, email addresses, delivery addresses, phone numbers and payment details through our website. We also use cookies for analytics (Google Analytics) and for remembering shopping basket contents. We do NOT sell or share customer data with third parties for marketing — the old terms say we do but that has never actually been the case and needs correcting.

2. Consumer rights — I understand the rules around returns and cancellations have changed. We want to make sure we are giving customers their full rights. We are happy to offer a 30-day returns policy which I believe is more generous than the minimum requirement.

3. Subscription service — We launched a monthly subscription box service ("The GreenLeaf Box") in 2022. Customers pay £24.99/month and receive a curated selection of seasonal gardening products. They can cancel at any time with 14 days' notice before the next billing date. This is not mentioned in our current terms at all and needs adding.

4. Dispute resolution — We had a difficult complaint last year that ended up with Trading Standards getting involved. Our solicitor at the time suggested we add an alternative dispute resolution clause. Could you include something appropriate?

5. General tidy-up — Please review the whole document and update anything else you think needs changing. We trust your judgment on this.

We would like the first draft by end of play on Wednesday if possible. No need to send a full advice letter at this stage — just the updated terms and a short email setting out what you have changed and why so I can review it with our board.

If you have any questions, do not hesitate to get in touch. My direct line is 01234 567890 and I am usually available between 9am and 5pm.

Kind regards,

Sarah Mitchell
Managing Director
GreenLeaf Home & Garden Ltd
Unit 4, Meadow Business Park
Cheltenham, Gloucestershire GL50 3QR
Tel: 01234 567890
Email: sarah.mitchell@greenleafhomeandgarden.co.uk`

const V1_TERMS_TEXT = `Terms and Conditions — GreenLeaf Home & Garden Ltd

Last Updated: 12 March 2016

1. Introduction

These terms and conditions govern your use of the GreenLeaf Home & Garden Ltd website (www.greenleafhomeandgarden.co.uk) and the purchase of products from us. By using our website you agree to be bound by these terms.

GreenLeaf Home & Garden Ltd is a company registered in England and Wales (Company No. 08451237) with its registered office at Unit 4, Meadow Business Park, Cheltenham, Gloucestershire, GL50 3QR.

2. Products and Pricing

2.1 All products are subject to availability. We reserve the right to withdraw any product from the website at any time.

2.2 Prices are as quoted on the website and include VAT at the current rate. We reserve the right to change prices at any time without notice.

2.3 We make every effort to ensure prices are correct. If we discover an error in the price of goods you have ordered, we will inform you and give you the option of continuing with the order at the correct price or cancelling the order.

3. Orders

3.1 When you place an order through our website, you are making an offer to purchase the goods. We will send you an email acknowledging receipt of your order. This does not mean your order has been accepted.

3.2 Acceptance of your order takes place when we dispatch the goods to you, at which point a contract is formed between you and us.

3.3 We reserve the right to refuse any order for any reason.

4. Payment

4.1 Payment must be made in full at the time of ordering. We accept Visa, Mastercard and PayPal.

4.2 All credit/debit card holders are subject to validation checks and authorisation by the card issuer.

5. Delivery

5.1 We aim to deliver goods within 5-7 working days of dispatch. Delivery times are estimates only and we shall not be liable for any delay.

5.2 Delivery charges will be displayed at checkout.

5.3 Risk in the goods passes to you on delivery.

6. Returns

6.1 You have the right to cancel your order within 7 days of receiving the goods, provided the goods are unused and in their original packaging.

6.2 To cancel, you must notify us in writing (by email or post) within 7 days of receipt.

6.3 You are responsible for the cost of returning the goods to us.

6.4 Refunds will be processed within 30 days of receiving the returned goods.

7. Warranties

7.1 All goods are covered by the manufacturer's warranty where applicable.

7.2 Nothing in these terms affects your statutory rights.

8. Limitation of Liability

8.1 Our total liability to you in respect of all losses arising under or in connection with these terms shall not exceed the price paid by you for the goods.

8.2 We shall not be liable for any indirect, special or consequential loss or damage.

8.3 We shall not be liable for any loss of profit, loss of business, or loss of goodwill.

9. Data Protection

9.1 We will use the information you provide to process your orders and to provide you with information about our products and services.

9.2 We may share your information with third parties for marketing purposes.

9.3 By placing an order, you consent to the use of your data as described above.

10. Intellectual Property

10.1 All content on this website, including text, graphics, logos and images, is the property of GreenLeaf Home & Garden Ltd and is protected by copyright law.

11. General

11.1 These terms are governed by the laws of England and Wales.

11.2 If any part of these terms is found to be unenforceable, the remaining parts shall continue to apply.

11.3 Our failure to enforce any right under these terms shall not constitute a waiver of that right.

11.4 These terms constitute the entire agreement between you and us.

GreenLeaf Home & Garden Ltd — "Bringing Nature Home"`

const V2_TERMS_TEXT = `Terms and Conditions — GreenLeaf Home & Garden Ltd

Last Updated: February 2026

1. About Us and These Terms

1.1 These terms and conditions ("Terms") govern your use of the website www.greenleafhomeandgarden.co.uk ("Website") and any purchases you make from us, including subscriptions to The GreenLeaf Box service.

1.2 GreenLeaf Home & Garden Ltd ("we", "us", "our") is a company registered in England and Wales (Company No. 08451237) with its registered office at Unit 4, Meadow Business Park, Cheltenham, Gloucestershire, GL50 3QR. Our VAT registration number is GB 123 4567 89.

1.3 To contact us, please email hello@greenleafhomeandgarden.co.uk, call us on 01234 567890 (Monday to Friday, 9am to 5pm), or write to us at the address above.

1.4 If you are a consumer, please note that these Terms, and any contract between us, are governed by the Consumer Rights Act 2015 and the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013. Nothing in these Terms will affect your statutory rights.

1.5 We may update these Terms from time to time. The version that applies to your order is the version in force at the time you place your order.

2. Products and Pricing

2.1 All products listed on our Website are subject to availability. We will inform you as soon as possible if a product you have ordered is unavailable and offer you an alternative or a full refund.

2.2 Prices are displayed on the Website inclusive of VAT at the applicable rate. Delivery charges are shown separately at checkout before you confirm your order.

2.3 We take reasonable care to ensure that prices are correct. If we discover a genuine pricing error before we have accepted your order, we will contact you to inform you of the correct price. You may then choose to proceed at the correct price or cancel the order for a full refund.

3. Placing an Order

3.1 When you place an order through our Website, this constitutes an offer to purchase the goods from us.

3.2 We will send you an email acknowledging your order ("Order Confirmation"). Please note that this does not constitute acceptance of your order.

3.3 A legally binding contract between you and us is formed when we send you a dispatch confirmation email ("Dispatch Confirmation").

3.4 We reserve the right to decline any order. If we do so, we will notify you promptly and issue a full refund for any payment already taken.

4. Payment

4.1 Payment for one-off orders must be made in full at the time of ordering. We accept Visa, Mastercard, American Express and PayPal.

4.2 Payment for The GreenLeaf Box subscription is taken monthly in advance by recurring card payment or Direct Debit (see Section 8 below for full subscription terms).

4.3 All card transactions are subject to validation and authorisation by your card issuer. We are not responsible for any charges imposed by your card issuer or bank.

4.4 We use industry-standard encryption and PCI DSS-compliant payment processing. We do not store your full payment card details on our systems.

5. Delivery

5.1 We aim to deliver goods within 3–5 working days of dispatch for standard delivery and 1–2 working days for express delivery. These are estimates and not guaranteed timeframes.

5.2 Delivery charges and estimated timescales are displayed at checkout before you confirm your order.

5.3 If delivery is significantly delayed (more than 30 days from the date of your order, or past any agreed delivery date), you have the right to cancel your order and receive a full refund.

5.4 Ownership of and risk in the goods will pass to you on delivery (or on the date you collect the goods from us, if applicable).

5.5 If no one is available to accept delivery, our courier may leave the parcel in a safe place or with a neighbour, or leave a card with instructions for redelivery or collection.

6. Your Right to Cancel (Cooling-Off Period)

6.1 If you are a consumer, you have the right to cancel your order within 14 days of receiving the goods without giving any reason, in accordance with the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013.

6.2 To exercise your right to cancel, you must inform us of your decision by a clear statement. You may use the Model Cancellation Form below, but this is not obligatory. You can contact us by email at returns@greenleafhomeandgarden.co.uk or by post at the address in Section 1.2.

6.3 If you cancel within the 14-day cooling-off period, we will reimburse all payments received from you, including the cost of standard delivery (but not any supplementary delivery costs if you chose a more expensive delivery option). We will make the reimbursement within 14 days of either receiving the returned goods or receiving proof that you have sent them back, whichever is earlier.

6.4 You must send back the goods without undue delay and in any event no later than 14 days from the day on which you inform us of your cancellation. You will bear the direct cost of returning the goods unless the goods are faulty or not as described.

6.5 The right to cancel does not apply to goods that have been personalised, perishable goods (such as live plants or cut flowers), or sealed goods that are not suitable for return for hygiene reasons once opened.

7. Extended Returns Policy

7.1 In addition to your statutory right to cancel within 14 days, we offer an extended returns policy of 30 days from the date of delivery. Goods must be unused, undamaged and in their original packaging.

7.2 To return goods under our extended returns policy, please contact us at returns@greenleafhomeandgarden.co.uk. We will provide you with a returns reference number and instructions.

7.3 Refunds under the extended returns policy will be processed within 14 days of our receipt of the returned goods, to your original payment method.

7.4 You are responsible for the cost of return postage under the extended returns policy unless the goods are faulty or not as described.

8. The GreenLeaf Box — Subscription Service

8.1 The GreenLeaf Box is a monthly subscription service. Each month, subscribers receive a curated selection of seasonal gardening products delivered to their door.

8.2 The subscription fee is £24.99 per month, inclusive of VAT and standard UK delivery. Payment is taken monthly in advance on the same date each month (or the next working day).

8.3 Your subscription will continue on a rolling monthly basis until cancelled.

8.4 You may cancel your subscription at any time by giving us at least 14 days' notice before your next billing date. You can cancel by emailing subscriptions@greenleafhomeandgarden.co.uk or by managing your subscription through your account on our Website. You will continue to receive The GreenLeaf Box for any period already paid for.

8.5 Your statutory right to cancel under the Consumer Contracts Regulations applies to your first GreenLeaf Box order. You have 14 days from receipt of your first box to cancel and receive a full refund (subject to the return of the box contents in accordance with Section 6).

8.6 We reserve the right to change the subscription price with at least 30 days' written notice. If you do not wish to continue at the new price, you may cancel in accordance with Section 8.4.

8.7 We may vary the contents of The GreenLeaf Box from month to month. The specific items included are at our discretion, though we will always aim to provide products of equivalent or greater value to the subscription price.

9. Faulty Goods and Your Statutory Rights

9.1 Under the Consumer Rights Act 2015, goods must be of satisfactory quality, fit for purpose and as described. If goods you receive are faulty, not as described, or not fit for purpose, you are entitled to the following remedies:

(a) Within 30 days of delivery: you are entitled to a full refund.
(b) After 30 days but within 6 months: we will repair or replace the goods. If repair or replacement is not possible or unsuccessful, you are entitled to a full refund.
(c) After 6 months but within 6 years: you may still be entitled to a repair, replacement or partial refund, but you may need to prove that the fault was present at the time of delivery.

9.2 To report faulty goods, please contact us at returns@greenleafhomeandgarden.co.uk with your order number and a description (and photographs if possible) of the fault. We will cover the cost of returning faulty goods to us.

10. Limitation of Liability

10.1 Nothing in these Terms limits or excludes our liability for death or personal injury caused by our negligence, fraud or fraudulent misrepresentation, or any matter for which it would be unlawful to exclude or restrict liability.

10.2 Subject to Section 10.1, our total liability to you in respect of all losses arising under or in connection with these Terms, whether in contract, tort (including negligence), breach of statutory duty or otherwise, shall not exceed the total price paid by you for the relevant goods or services.

10.3 Subject to Section 10.1, we shall not be liable for any indirect or consequential loss, loss of profit, loss of business, loss of goodwill, or loss of data.

10.4 We are not liable for any failure or delay in performing our obligations where such failure or delay results from circumstances beyond our reasonable control, including (but not limited to) severe weather, natural disaster, pandemic, strikes, supply chain disruption, or government action.

11. Privacy and Data Protection

11.1 We take the protection of your personal data seriously. We process your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.

11.2 When you place an order or create an account, we collect personal data including your name, email address, delivery address, telephone number and payment details. We process this data for the purposes of fulfilling your orders, managing your account, and communicating with you about your orders.

11.3 We will only send you marketing communications if you have given us your explicit consent to do so. You can withdraw your consent at any time by clicking the "unsubscribe" link in any marketing email or by contacting us.

11.4 We do not sell, rent or share your personal data with third parties for their marketing purposes.

11.5 We may share your data with trusted service providers who assist us in operating our business (such as payment processors, delivery couriers and IT service providers). These providers are contractually required to process your data only on our instructions and in accordance with applicable data protection law.

11.6 For full details of how we collect, use, store and protect your personal data, including your rights under data protection law (including the rights of access, rectification, erasure, restriction, data portability and objection), please see our separate Privacy Policy at www.greenleafhomeandgarden.co.uk/privacy.

11.7 Our Data Protection contact can be reached at privacy@greenleafhomeandgarden.co.uk.

12. Cookies

12.1 Our Website uses cookies. We use essential cookies to enable core website functionality (such as remembering your shopping basket) and analytics cookies (Google Analytics) to help us understand how visitors use our Website.

12.2 Non-essential cookies are only placed on your device with your consent. You can manage your cookie preferences at any time using the cookie settings tool on our Website.

12.3 For full details, please see our Cookie Policy at www.greenleafhomeandgarden.co.uk/cookies.

13. Intellectual Property

13.1 All content on this Website, including text, graphics, logos, photographs, images and software, is the property of GreenLeaf Home & Garden Ltd (or our licensors) and is protected by copyright, trademark and other intellectual property laws.

13.2 You may not reproduce, distribute, modify or create derivative works from any content on this Website without our prior written consent.

14. Complaints and Dispute Resolution

14.1 If you are unhappy with any aspect of our products or service, please contact us in the first instance at hello@greenleafhomeandgarden.co.uk or by calling 01234 567890. We will do our best to resolve your complaint promptly.

14.2 If we are unable to resolve your complaint to your satisfaction, you may refer the matter to an approved Alternative Dispute Resolution (ADR) provider. For consumer disputes relating to online purchases, you may also use the UK's online dispute resolution platform, which can be found at https://www.gov.uk/consumer-protection-rights.

14.3 We are not obliged to submit to ADR but will consider doing so on a case-by-case basis. If we agree to participate in ADR, we will confirm the details of the ADR provider to you in writing.

14.4 Nothing in this section affects your right to take legal action.

15. General

15.1 These Terms are governed by the laws of England and Wales. If you are a consumer resident in Scotland or Northern Ireland, you may also bring proceedings in the courts of your home jurisdiction.

15.2 If any provision of these Terms is found to be invalid or unenforceable by a court, the remaining provisions shall continue in full force and effect.

15.3 A failure by us to exercise or enforce any right under these Terms shall not constitute a waiver of that right.

15.4 These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and us in relation to your use of our Website and any purchases made through it.

15.5 We may transfer our rights and obligations under these Terms to another organisation. We will notify you in writing if this happens and ensure your rights are not adversely affected.

Model Cancellation Form

(You only need to complete and return this form if you wish to cancel your order within the 14-day cooling-off period.)

To: GreenLeaf Home & Garden Ltd, Unit 4, Meadow Business Park, Cheltenham, Gloucestershire, GL50 3QR / returns@greenleafhomeandgarden.co.uk

I hereby give notice that I cancel my contract for the supply of the following goods:

- Order number:
- Ordered on / received on:
- Name:
- Address:
- Signature (only if this form is sent on paper):
- Date:

GreenLeaf Home & Garden Ltd — "Bringing Nature Home"`

const IDEAL_EMAIL_TEXT = `From: [Trainee Solicitor]
To: Sarah Mitchell, Managing Director — GreenLeaf Home & Garden Ltd
CC: James Harrington, Partner — [Your Firm]
Date: 12 February 2026
Subject: RE: Update to Website Terms and Conditions — First Draft Enclosed

Dear Sarah,

Thank you for your instructions. Please find enclosed the updated Terms and Conditions for the GreenLeaf Home & Garden website. I have set out below a summary of the key changes made and the reasons for them.

1. Data Protection and Privacy (Sections 11 and 12)

This was the area requiring the most significant overhaul. The previous terms predated the UK GDPR and the Data Protection Act 2018 and were not compliant with current law. Key changes include:

- Removed the clause stating that customer data may be shared with third parties for marketing purposes. I understand this never reflected your actual practice, and including it created both a misleading impression and potential regulatory risk.
- Added clear information about the lawful basis for processing personal data, the types of data collected, and the purposes for which it is used.
- Added a reference to customers' data protection rights, including the rights of access, rectification, erasure and data portability.
- Marketing communications are now stated to require explicit opt-in consent, with a clear right to unsubscribe at any time.
- Added a separate Cookies section addressing the use of essential and analytics cookies and the requirement for consent for non-essential cookies, in line with the Privacy and Electronic Communications Regulations 2003.
- I would recommend that you also have a standalone Privacy Policy and Cookie Policy on the website, which I can draft separately if helpful. The updated Terms reference these documents.

2. Consumer Rights — Returns and Cancellation (Sections 6, 7 and 9)

The previous terms gave customers only 7 days to return goods, which did not comply with the Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013. Key changes:

- Updated the statutory cancellation period to 14 days from receipt, as required by the 2013 Regulations. This is a legal requirement for all distance selling.
- Added a Model Cancellation Form at the end of the Terms, as required by the Regulations.
- Added your extended 30-day returns policy as a separate section, making clear this is offered in addition to (and is more generous than) the statutory minimum.
- Updated the refund timeframe — we are now required to process refunds within 14 days (the previous terms stated 30 days, which was non-compliant).
- Added a section on faulty goods reflecting the Consumer Rights Act 2015, setting out the tiered remedies (full refund within 30 days, repair/replace within 6 months, and reduced rights up to 6 years).
- Listed the exceptions to the right to cancel (personalised goods, perishables, hygiene-sealed goods), which are relevant to your product range.

3. The GreenLeaf Box — Subscription Service (Section 8)

This is entirely new. The section covers:

- The nature of the subscription and monthly pricing (£24.99/month).
- The rolling monthly basis and the right to cancel with 14 days' notice before the next billing date, as you instructed.
- Application of the statutory cooling-off period to the first subscription box.
- Your right to vary contents and change pricing with 30 days' notice.

4. Alternative Dispute Resolution (Section 14)

I have added a complaints and dispute resolution section as you requested. This includes:

- An initial complaints process directing customers to contact you first.
- A reference to Alternative Dispute Resolution (ADR), as required by the Alternative Dispute Resolution for Consumer Disputes (Competent Authorities and Information) Regulations 2015. Please note that you are required to inform consumers about ADR even if you do not commit to using it, so the clause is drafted on the basis that you will consider ADR on a case-by-case basis.
- A reference to the UK's online dispute resolution resources.

5. Other Updates

- Limitation of liability (Section 10): Updated to include a proper carve-out for death, personal injury, fraud and other matters that cannot lawfully be excluded. Added a force majeure provision.
- Payment (Section 4): Added reference to payment security standards (PCI DSS) and clarified that you do not store full card details.
- Delivery (Section 5): Updated to reflect that consumers have the right to cancel if delivery is significantly delayed (30+ days), as required under the Consumer Rights Act 2015.
- Contact details (Section 1): Expanded to include email, phone and postal contact details, and a VAT registration number — both of which are required for online traders under the E-Commerce Regulations 2002.
- Governing law (Section 15): Added a note that consumers in Scotland or Northern Ireland may bring proceedings in their local courts, reflecting the applicable case law.
- General housekeeping: Improved the structure, numbering and clarity of drafting throughout.

Next Steps

Please review the draft with your board and let me know if you have any comments or would like any amendments. In particular:

1. I have included a placeholder VAT registration number — please confirm the correct number so I can update this.
2. As noted above, I would recommend we also prepare a standalone Privacy Policy and Cookie Policy. Please let me know if you would like me to draft these.
3. You may wish to have your web developer review the updated terms on the website to ensure the cookie consent mechanism and cancellation form are properly implemented.

Please do not hesitate to contact me if you have any questions.

Kind regards,

[Trainee Solicitor]
[Your Firm]`

const EXERCISE_MARKDOWN = `# Website T&Cs Redraft — Training Exercise

## Background

You are a trainee solicitor at a commercial law firm. Your supervising partner, James Harrington, has passed you an instruction from a client — Sarah Mitchell, Managing Director of GreenLeaf Home & Garden Ltd.

GreenLeaf is a small but growing online retailer of home and garden products based in Cheltenham. They also run a monthly subscription box service called "The GreenLeaf Box." Their website terms and conditions have not been updated since March 2016 and need a comprehensive refresh.

## Your Role

You have been asked to:
1. Review the existing terms and conditions
2. Identify the legal issues and compliance gaps
3. Draft updated terms and conditions
4. Draft a short covering email to the client explaining what you changed and why

## Documents Provided

- **Client Instruction Email** — The brief from Sarah Mitchell setting out what she needs
- **Original Terms and Conditions (Version 1)** — The current website terms from March 2016

## Key Legislation to Consider

- Consumer Rights Act 2015
- Consumer Contracts (Information, Cancellation and Additional Charges) Regulations 2013
- UK General Data Protection Regulation (UK GDPR) / Data Protection Act 2018
- Privacy and Electronic Communications Regulations 2003 (PECR)
- Alternative Dispute Resolution for Consumer Disputes (Competent Authorities and Information) Regulations 2015
- E-Commerce Regulations 2002

## How This Exercise Works

1. **Step 1 — Review:** Read the client email and current terms carefully
2. **Step 2 — Identify Issues:** List all the legal problems you can find in the current terms
3. **Step 3 — Redraft:** Produce complete updated terms and conditions
4. **Step 4 — Covering Email:** Write a professional email to the client explaining your changes

You may ask questions at any time using the chat panel — this simulates asking your supervising partner for guidance. Your questions will be assessed for relevance and quality as part of the exercise.

**Take your time.** This exercise is designed to take 4–6 hours, simulating a real working day on a client matter. Quality matters more than speed.

---

*Good luck!*`

// ============================================================
// SPA Disclosure Letter Exercise
// ============================================================

function buildSpaDisclosureExercise(): Exercise {
  const now = new Date().toISOString()

  const exercise: Exercise = {
    id: SPA_DISCLOSURE_ID,
    title: 'SPA Disclosure Letter',
    description: 'Prepare a Disclosure Letter against an SPA warranties schedule for the sale of a precision manufacturing company. Review the client background information, identify disclosable matters, draft the letter with proper warranty references, and prepare an internal memo flagging concerns and follow-up items.',
    matterType: 'Corporate — Share Purchase Agreement / Disclosure Letter',
    difficulty: 'mid',
    estimatedDurationMinutes: 480,
    documents: [
      {
        id: SPA_DOC_IDS.backgroundPack,
        exerciseId: SPA_DISCLOSURE_ID,
        filename: 'client_background_pack.md',
        mimeType: 'text/markdown',
        role: 'instruction',
        label: 'Client Background Information Pack',
        extractedText: SPA_BACKGROUND_PACK_TEXT,
        uploadedAt: now,
      },
      {
        id: SPA_DOC_IDS.warrantiesSchedule,
        exerciseId: SPA_DISCLOSURE_ID,
        filename: 'spa_warranties_schedule.md',
        mimeType: 'text/markdown',
        role: 'source-material',
        label: 'SPA Warranties Schedule (Draft)',
        extractedText: SPA_WARRANTIES_TEXT,
        uploadedAt: now,
      },
      {
        id: SPA_DOC_IDS.idealDisclosureLetter,
        exerciseId: SPA_DISCLOSURE_ID,
        filename: 'ideal_disclosure_letter.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Disclosure Letter',
        extractedText: SPA_IDEAL_DISCLOSURE_TEXT,
        uploadedAt: now,
      },
      {
        id: SPA_DOC_IDS.idealMemo,
        exerciseId: SPA_DISCLOSURE_ID,
        filename: 'ideal_internal_memo.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Internal Memo',
        extractedText: SPA_IDEAL_MEMO_TEXT,
        uploadedAt: now,
      },
    ],
    steps: [
      {
        id: 'step-1',
        order: 1,
        title: 'Review Instructions and Documents',
        instruction: `You are a trainee solicitor in the corporate department. Your supervising partner, James Harrington, has asked you to prepare a Disclosure Letter against the attached warranties schedule based on the information in the client background pack. You should also prepare a short internal memo to James flagging any concerns, items requiring follow-up, and issues you anticipate the Buyer raising.

**Your task:** Read both documents carefully — the SPA Warranties Schedule and the Client Background Information Pack.

As you read, consider:
- Which facts from the background pack are relevant to each warranty
- Which facts need to be disclosed and which do not
- What additional information you might need

You may ask questions at any time using the chat — treat me as James Harrington, your supervising partner. When you are ready, mark this step as complete.`,
        type: 'read',
        visibleDocuments: [SPA_DOC_IDS.backgroundPack, SPA_DOC_IDS.warrantiesSchedule],
        idealOutput: null,
        gradingCriteria: [],
        maxScore: 0,
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Draft Disclosure Letter',
        instruction: `Now draft the Disclosure Letter against the warranties schedule.

**Your task:** Produce a complete Disclosure Letter that:
- Opens with a proper introduction referencing the SPA, parties and purpose
- Includes a General Disclosures section (Companies House searches, Land Registry, accounts, Buyer's knowledge)
- Contains Specific Disclosures referenced to the correct warranty numbers from the schedule
- Provides sufficient factual detail for each disclosure (dates, amounts, names, circumstances)
- Cross-references disclosures where a single fact is relevant to multiple warranties
- Includes a Disclosure Bundle index listing supporting documents
- Uses neutral, factual language — neither minimising issues nor creating unnecessary alarm
- Uses appropriate qualifiers where information is uncertain

**Important:** The Sellers are personally liable for warranty claims. When in doubt, disclose. But exercise judgment — not every fact in the background pack needs to be disclosed.

Take your time — this is the main deliverable. You may continue to ask questions via the chat.`,
        type: 'draft',
        visibleDocuments: [SPA_DOC_IDS.backgroundPack, SPA_DOC_IDS.warrantiesSchedule],
        idealOutput: SPA_IDEAL_DISCLOSURE_TEXT,
        gradingCriteria: [
          'Structure: Proper introduction referencing SPA, parties, and purpose (1pt)',
          'Structure: General disclosures section covering Companies House, Land Registry, accounts, Buyer\'s knowledge (2pts)',
          'Structure: Specific disclosures clearly referenced to warranty numbers (3pts)',
          'Structure: Disclosure Bundle index with comprehensive document list (2pts)',
          'Completeness: Identifies and discloses Hartwell debt — no provision in accounts (Warranties 2.2, 2.3, 2.6) — CRITICAL',
          'Completeness: Identifies and discloses JLR change of control clause (Warranty 4.4) — CRITICAL',
          'Completeness: Identifies and discloses HMRC R&D tax credit enquiry (Warranty 3.3) — CRITICAL',
          'Completeness: Identifies and discloses Tom Griffiths personal injury claim (Warranties 1.7, 6.3) — CRITICAL',
          'Completeness: Identifies and discloses mezzanine — no landlord consent or building regs (Warranties 5.4, 5.5) — CRITICAL',
          'Completeness: Identifies and discloses interim dividend of £50,000 (Warranty 2.4(c)) — CRITICAL',
          'Completeness: Identifies and discloses data protection non-compliance (Warranty 8.3) — CRITICAL',
          'Completeness: Identifies and discloses Linda Chen related party transaction (Warranty 2.4(a)) — CRITICAL',
          'Completeness: Discloses 2014 articles amendment — special resolution not located (Warranty 1.4)',
          'Completeness: Discloses shareholders\' agreement not strictly followed (Warranty 1.4)',
          'Completeness: Discloses CNC machine £78,000 capital expenditure (Warranty 2.4(e))',
          'Completeness: Discloses Barclays overdraft facility and floating charge (Warranty 2.5)',
          'Completeness: Discloses PAYE RTI penalty (Warranty 3.1)',
          'Completeness: Discloses VAT zero-rating documentation uncertainty (Warranty 3.5)',
          'Completeness: Discloses Midlands Motor Parts £42k disputed claim (Warranties 4.5, 4.6)',
          'Completeness: Discloses Steelco price increase (Warranty 4.4)',
          'Completeness: Discloses mezzanine no building regs approval (Warranty 5.5)',
          'Completeness: Discloses Environment Agency drainage notice (Warranty 5.6)',
          'Completeness: Discloses outstanding rent review (Warranty 5.3)',
          'Completeness: Discloses David Liu 5% profit share (Warranty 6.1)',
          'Completeness: Discloses Karen White unfair dismissal settlement (Warranty 6.3)',
          'Completeness: Discloses David Liu dissatisfaction / retention risk (Warranty 6.4)',
          'Completeness: Discloses late auto-enrolment and compliance notice (Warranty 6.7)',
          'Completeness: Discloses no employee handbook or written policies (Warranty 8.2)',
          'Completeness: Discloses Atlas Components similar designs (Warranty 7.3)',
          'Completeness: Discloses trade mark renewal due July 2026 (Warranty 7.5)',
          'Completeness: Discloses Sarah Okonkwo IP assignment uncertainty (Warranty 7.5)',
          'Completeness: Discloses AS9100 minor non-conformances (Warranty 8.1)',
          'Completeness: Discloses Tom Griffiths outstanding insurance claim (Warranty 9.4)',
          'Completeness: Discloses no cyber or D&O insurance (Warranty 9.1)',
          'Completeness: Discloses 2021 cutting oil spillage (Warranty 10.3)',
          'Completeness: Discloses no environmental permit formally verified (Warranty 10.2)',
          'Quality: Disclosures contain sufficient factual detail — dates, amounts, names, circumstances (3pts)',
          'Quality: Cross-referencing where facts are relevant to multiple warranties (2pts)',
          'Quality: Neutral, factual tone without editorialising or minimising (2pts)',
          'Quality: Appropriate qualification language where information is uncertain (2pts)',
          'Quality: No over-disclosure of strategy or privilege (1pt)',
          'Quality: References to supporting documents at specific Disclosure Bundle tabs (2pts)',
          'Judgment: Does not disclose matters that do not need disclosing (e.g. subjective opinions, seller\'s future plans)',
        ],
        maxScore: 55,
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Draft Internal Memo',
        instruction: `Now prepare a short internal memo to your supervising partner, James Harrington.

**Your task:** Draft a memo that:
- Identifies the key issues arising from your review, prioritised by importance to the deal
- Distinguishes between high-priority deal issues and lower-priority compliance gaps
- Provides clear recommended actions for each issue
- Shows commercial awareness — how do these issues affect the deal, not just legal compliance?
- Anticipates what the Buyer's solicitors are likely to raise or request
- Is appropriately structured and concise for an internal audience

This is an internal document — you can be more candid and analytical than in the Disclosure Letter. The partner wants your assessment of the issues, not just a list of facts.`,
        type: 'draft',
        visibleDocuments: [SPA_DOC_IDS.backgroundPack, SPA_DOC_IDS.warrantiesSchedule],
        idealOutput: SPA_IDEAL_MEMO_TEXT,
        gradingCriteria: [
          'Identifies JLR change of control as deal risk — revenue impact, strategy recommendation, anticipates Buyer response (3pts)',
          'Identifies Hartwell debt financial impact — write-down, completion accounts adjustment (2pts)',
          'Identifies HMRC R&D enquiry — tax exposure up to £95,000+, recommends reviewing claims, anticipates specific indemnity (3pts)',
          'Identifies David Liu retention risk — key man risk, suggests incentive, notes non-compete (2pts)',
          'Identifies mezzanine issues — recommends retrospective consent and building regs regularisation (2pts)',
          'Identifies data protection compliance gaps — recommends remediation before completion (2pts)',
          'Identifies VAT zero-rating documentation gap — recommends urgent investigation (2pts)',
          'Lists anticipated Buyer requests — indemnities, retentions, conditions, undertakings (2pts)',
          'Prioritisation: Distinguishes between high-priority deal issues and lower-priority compliance gaps (3pts)',
          'Actionable recommendations: Each issue has a clear recommended next step (3pts)',
          'Commercial awareness: Shows understanding of how issues affect the deal commercially (3pts)',
          'Professional presentation: Clear structure, appropriate for internal audience, concise but thorough (3pts)',
        ],
        maxScore: 30,
      },
    ],
    rubric: {
      exerciseId: SPA_DISCLOSURE_ID,
      overallApproach: 'The trainee should systematically read through the warranties schedule and match each warranty against the facts in the background pack. They should exercise judgment about materiality and relevance, identifying which facts need to be disclosed (and which do not). The disclosure letter should be thorough, precisely drafted, and properly cross-referenced. The internal memo should go beyond restating facts — it should analyse the issues commercially, prioritise them, and recommend actions. The exercise tests the trainee\'s ability to handle a realistic corporate transaction task from start to finish.',
      keyIssues: [
        'Hartwell Automotive debt — £85k with no provision, CVA means recovery of 15-25p in the pound',
        'JLR change of control clause — largest customer (£1.2m/year), termination right on change of ownership',
        'HMRC R&D tax credit enquiry — £95,000 in claims under investigation',
        'Tom Griffiths — threatened personal injury claim, on long-term sick leave',
        'Mezzanine floor — no formal landlord consent, no building regulations approval',
        'Interim dividend of £50,000 paid post-Accounts Date',
        'Linda Chen bookkeeping — undisclosed related party transaction (£24,000/year)',
        'Data protection — no policy, no privacy notice, no DPO assessment',
        'David Liu retention risk — unhappy about exclusion from sale proceeds',
        'VAT zero-rating — missing export documentation for Irish customer',
        'Steelco 12% price increase — affects margins from April 2026',
        'Midlands Motor Parts — £42k disputed claim',
        'Karen White unfair dismissal — settled for £8,500',
        'Late pension auto-enrolment — compliance notice from TPR',
        'Sarah Okonkwo — uncertain IP assignment clause',
        'AS9100 non-conformance close-out evidence missing',
        '2021 oil spillage — Environment Agency not notified',
        'No environmental permit formally verified',
        'No cyber or D&O insurance',
        'Outstanding rent review — landlord seeking increase to £105,000',
      ],
      criticalErrors: [
        'Missing Hartwell debt disclosure — material financial impact, obvious from the information',
        'Missing JLR change of control disclosure — largest customer, could terminate post-completion',
        'Missing HMRC R&D enquiry disclosure — active investigation, significant potential liability',
        'Missing Tom Griffiths personal injury disclosure — active threatened litigation',
        'Missing mezzanine disclosure — breach of lease, regulatory non-compliance',
        'Missing interim dividend disclosure — directly contradicts Warranty 2.4(c)',
        'Missing data protection non-compliance disclosure — regulatory risk, express warranty',
        'Missing Linda Chen related party transaction disclosure — undisclosed related party arrangement',
        'Including privileged or strategic information in the disclosure letter (e.g. client intends to negotiate on price)',
        'Fundamentally wrong warranty references throughout the disclosure letter',
        'Memo reads as a second disclosure letter — lists facts without analysis or commercial assessment',
      ],
      qualityMarkers: [
        'Disclosure letter has proper structure — introduction, general disclosures, specific disclosures with warranty references, disclosure bundle index',
        'Cross-referencing where a single fact is relevant to multiple warranties',
        'Neutral, factual drafting tone — states facts without editorialising or minimising',
        'Appropriate use of qualifiers where information is uncertain (e.g. "the Sellers are unable to confirm at this time...")',
        'Exercises judgment about what does NOT need disclosing (e.g. subjective opinions about relationships, seller retirement plans)',
        'Internal memo prioritises issues by deal impact, not just listing them alphabetically',
        'Memo includes anticipated Buyer requests — indemnities, retentions, conditions, undertakings',
        'Memo provides actionable recommendations, not just issue identification',
        'Shows commercial awareness — understands how issues affect deal price, structure, and timing',
        'Memo distinguishes between deal-critical issues (JLR, Hartwell, HMRC) and compliance housekeeping (employee handbook, H&S policy)',
      ],
      questionRelevanceGuidance: `Excellent questions (+3 points) show commercial awareness and initiative: "Should we consider approaching JLR before exchange to manage the change of control risk?" / "Do we have copies of the R&D tax credit claims to assess the strength of the Company's position?" / "Has the client considered offering David Liu a retention payment?"

Good questions (+2 points) are relevant to disclosure or identify a gap: "Can you confirm whether the 2014 special resolution has been found yet?" / "Do we know what the lease says specifically about alterations — is it an absolute or qualified covenant?" / "Has the Midlands Motor Parts claim been notified to the product liability insurers?"

Adequate questions (+1 point) are reasonable but obvious: "Should I disclose the overdraft facility even though the balance is nil?" / "What format should the Disclosure Letter take?"

Neutral questions (0 points): "How long should the memo be?"

Poor questions (-1 point) ask about information already provided: "What does the Company do?" / "How many employees are there?"

Very poor questions (-2 points) fundamentally misunderstand the exercise: "Should we be drafting warranties?" / "Is this a purchase of assets or shares?"

Responses to anticipated questions:
- JLR approach strategy: "Good question. For now, focus on the disclosure. But flag it prominently in your memo — we'll need to discuss strategy with the client."
- R&D claim documentation: "We've asked for it but don't have it yet. Disclose what we know and flag it as a follow-up."
- Midlands Motor Parts insurer notification: "That's a very good question. I don't think it has been notified to the product liability insurer — only Tom Griffiths' injury has been notified to Aviva. Flag that as a follow-up item."
- Lease alterations covenant: "I haven't reviewed the lease in detail. For the purposes of the disclosure, work on the basis that it requires prior written consent, as Michael indicated. Flag the need to review the lease as a follow-up."
- Format of disclosure letter: "Standard format: general disclosures followed by specific disclosures referenced to warranty numbers. Include a disclosure bundle index."
- Whether to disclose something borderline: "When in doubt, disclose. The Sellers are personally liable for warranty claims. We'd rather over-disclose than under-disclose."`,
    },
    generatedMarkdown: SPA_EXERCISE_MARKDOWN,
    status: 'ready',
    createdAt: now,
    updatedAt: now,
  }

  return exercise
}

// --- SPA Exercise: Embedded Document Texts ---

const SPA_BACKGROUND_PACK_TEXT = `Client Background Information Pack

CONFIDENTIAL — Precision Fabrications Limited

Prepared for: [Trainee Solicitor]
Prepared by: James Harrington, Partner
Date: 3 February 2026
Matter: Sale of Precision Fabrications Limited to Northgate Industrial Group plc

Overview

We act for Michael Chen and Priya Sharma (the "Sellers"), who are the sole shareholders and directors of Precision Fabrications Limited (the "Company"). They are selling 100% of the issued share capital to Northgate Industrial Group plc (the "Buyer") for £4.2 million.

The Buyer's solicitors have sent across a draft SPA which includes an extensive warranties schedule. Your task is to prepare the Disclosure Letter against those warranties based on the information below.

I met with Michael and Priya last Thursday and went through the warranties with them. Below is a summary of everything they told me, plus some documents we have received from them. Some of these points will need to be disclosed; some will not. Part of the exercise is identifying which is which.

1. Corporate Information

The Company was incorporated on 15 June 2009. Company number 07123456. Registered office: Unit 12, Riverside Industrial Estate, Birmingham, B7 4QT.

The Company manufactures precision metal components, primarily for the automotive and aerospace industries.

Issued share capital: 1,000 ordinary shares of £1 each. Michael Chen holds 600 shares and Priya Sharma holds 400 shares. Both are directors.

There is one other director: David Liu, who is the Operations Director. He is not a shareholder but has a contractual entitlement to a 5% profit share, paid annually.

Michael mentioned that the Company's articles of association were last amended in 2014 to remove a pre-emption clause on share transfers. He could not immediately find a copy of the special resolution but said it "definitely happened." He has promised to look for it.

There is also a shareholders' agreement between Michael and Priya dated 2012. This includes tag-along and drag-along provisions. Michael asked whether the Buyer needs to know about this. He seems slightly reluctant to share it because it contains some provisions about the split of management responsibilities which he says are "a bit informal and not really followed anymore."

2. Financial Information

The most recent audited accounts are for the year ended 31 March 2025. These show:

- Turnover: £3.8 million
- Pre-tax profit: £410,000
- Net assets: £1.6 million
- Cash at bank: £285,000
- Trade debtors: £620,000
- Trade creditors: £340,000

Michael flagged the following points:

(a) There is a debt of £85,000 owed by Hartwell Automotive Ltd, which is included in trade debtors. Hartwell has been in financial difficulty and entered a CVA in November 2025. The administrators have indicated that unsecured creditors are likely to receive between 15p and 25p in the pound. No provision or write-down has been made for this debt in the accounts.

(b) In June 2025 (after the Accounts Date), Michael authorised the purchase of a new CNC milling machine for £78,000. This was funded from operating cash flow, not borrowings.

(c) Also since the Accounts Date, the Company paid an interim dividend of £50,000 (£30,000 to Michael, £20,000 to Priya) in August 2025.

(d) The Company has an overdraft facility of £100,000 with Barclays Bank, secured by a floating charge over the Company's assets. The current overdraft balance is nil but the facility (and floating charge) remains in place. This is disclosed in a note to the accounts but not in the main body.

(e) Michael's wife, Linda Chen, provides bookkeeping services to the Company on a freelance basis. She invoices £2,000 per month. This arrangement is not disclosed in the accounts as a related party transaction.

3. Tax

The Company's corporation tax affairs are up to date. However:

(a) The Company received a compliance check notice from HMRC in September 2025 relating to the R&D tax credit claims made for the years ended 31 March 2023 and 31 March 2024. The Company claimed a combined total of approximately £95,000 in R&D tax credits over those two years. Michael says the claims were prepared by their accountants (BDH Associates) and he believes they are legitimate, but HMRC has asked for further information and supporting documentation. No assessment or adjustment has been made by HMRC yet, and the enquiry is ongoing.

(b) In 2022, the Company received a £15,000 penalty from HMRC for late filing of a PAYE Real Time Information (RTI) return. The penalty was paid in full but Michael says they subsequently appealed and got £10,000 of it refunded. The remaining £5,000 penalty stands.

(c) Michael mentioned that the Company zero-rated some supplies to a customer in the Republic of Ireland (Fitzpatrick Engineering Ltd) on the basis that they were exports. He said "the accountant handled it" but was unable to confirm whether the Company holds the required evidence of export (shipping documentation, etc.) to support the zero-rating.

4. Assets and Contracts

(a) Key contracts:

The Company has the following material contracts:

- JLR (Jaguar Land Rover): Customer — supply of brake components, £1.2m annual value, rolling with 6 months' notice. Largest customer, relationship since 2015.
- Rolls-Royce Holdings plc: Customer — supply of turbine blade fixings, £680,000 annual value, fixed 3-year term expiring Sept 2027. Requires AS9100 accreditation.
- Steelco UK Ltd: Supplier — raw materials (steel rod and sheet), £450,000 annual value, rolling with 3 months' notice. Price review clause — Steelco has notified a 12% price increase effective April 2026.
- Apex Tooling Solutions: Supplier — specialist tooling, £120,000 annual value, rolling with 1 month's notice. No issues.
- Birmingham Property Holdings Ltd: Landlord — lease of Unit 12. See Property section.

(b) Michael mentioned that the JLR contract contains a change of control clause. If the Company undergoes a change of ownership, JLR has the right (but not the obligation) to terminate the contract on 30 days' notice. Michael said he has an "excellent relationship" with JLR's procurement team and does not believe they would exercise this right, but he has not discussed the sale with them yet.

(c) In October 2025, the Company received a letter of complaint from Midlands Motor Parts Ltd, alleging that a batch of components delivered in September 2025 were defective and caused a production line stoppage. Midlands Motor Parts is claiming £42,000 in damages. The Company disputes the claim. No legal proceedings have been issued.

5. Property

The Company occupies Unit 12, Riverside Industrial Estate, Oakley Road, Birmingham, B7 4QT.

10-year lease from Birmingham Property Holdings Ltd, commencing 1 January 2020, expiring 31 December 2029. Current rent £85,000 pa. Rent review at 5-year mark (1 January 2025) has been triggered by landlord but not concluded — landlord seeks £105,000, Company's surveyor says £92,000–£95,000.

FRI lease. In 2023, the Company built an internal mezzanine floor — verbal approval from landlord's property manager but no formal written consent under the lease. No building regulations approval obtained.

Environment Agency notice in March 2025 regarding drainage — addressed to landlord, copied to tenants. Landlord dealing with it. No follow-up to the Company.

6. Employees

34 employees including the two Sellers and David Liu.

(a) Tom Griffiths (Senior CNC Operator, since 2011, £48,000) — long-term sick leave since August 2025 following back injury at work July 2025. Intends to bring personal injury claim. Aviva notified.

(b) Three redundancies in April 2025. Karen White brought unfair dismissal claim, settled via ACAS for £8,500 (COT3 signed).

(c) Group personal pension with Scottish Widows (5% contribution). Two months late auto-enrolling three new starters in 2024. Reported to TPR, compliance notice issued, resolved.

(d) David Liu has 12-month non-compete. Unhappy about exclusion from sale proceeds.

(e) No formal employee handbook or written policies (disciplinary, grievance, equal opportunities, data protection).

7. Intellectual Property

UK Trade Marks: "PRECISION FABRICATIONS" (word mark, UK00003456789, renewal July 2026) and PF Logo (device mark, UK00003456790, renewed 2024). Unregistered design rights and trade secrets. No patents.

Atlas Components marketed similar designs in 2024 — Company considered but declined legal action. Atlas has since stopped. No formal claims either way.

Sarah Okonkwo (Design Engineer, since 2016) developed component designs — IP assignment clause in contract but possibly not properly drafted.

8. Regulatory and Compliance

AS9100 Rev D certification (valid to May 2028) — two minor non-conformances at May 2025 audit, addressed but close-out evidence not yet provided. ISO 9001:2015 (valid to March 2027) — no issues.

Data protection: No written policy, no employee privacy notice, no DPO assessment. No breaches or complaints.

H&S policy not reviewed since 2019. Two RIDDOR incidents (Tom Griffiths July 2025, minor hand laceration February 2024).

9. Insurance

All policies with Aviva (EL £10m, PL £5m, Product Liability £5m, Buildings & Contents £2m, BI 12 months). All premiums up to date. Tom Griffiths claim notified to Aviva. No cyber or D&O insurance.

10. Environmental

Cutting oils, lubricants and degreasers used. Waste collected by licensed carrier (EnviroWaste Solutions). Waste transfer notes current but no formal audit in 3 years.

2021 cutting oil spillage (50 litres) — cleaned up internally, EA not notified. No environmental permit held — accountant says not needed but not formally verified.`

const SPA_WARRANTIES_TEXT = `SHARE PURCHASE AGREEMENT

Between
(1) MICHAEL CHEN and PRIYA SHARMA (together, the "Sellers")
(2) NORTHGATE INDUSTRIAL GROUP PLC ("the Buyer")

Relating to the entire issued share capital of
PRECISION FABRICATIONS LIMITED

DRAFT — FOR DISCUSSION PURPOSES ONLY
Prepared by: Northgate Legal Team
Date: January 2026

SCHEDULE 4 — WARRANTIES

The Sellers jointly and severally warrant to the Buyer that each of the following statements is true, accurate and not misleading as at the date of this Agreement and will be true, accurate and not misleading at Completion.

PART 1 — CORPORATE AND CONSTITUTIONAL

1.1 The Company is duly incorporated and validly existing under the laws of England and Wales.

1.2 The Company has not passed any resolution for its winding up and no petition has been presented or order made for its winding up or for the appointment of a provisional liquidator. No administrator has been appointed and no notice of intention to appoint an administrator has been filed. No administrative receiver or receiver has been appointed over the whole or any part of the Company's assets or undertaking.

1.3 The Company has not entered into, nor proposed, any voluntary arrangement or scheme of arrangement with its creditors under the Insolvency Act 1986.

1.4 The copies of the Company's memorandum and articles of association (or articles of association, as applicable) delivered to the Buyer are true and complete copies of the current constitutional documents and are fully up to date.

1.5 The statutory books and registers of the Company are up to date, accurate and complete in all respects and have been properly maintained in accordance with the Companies Act 2006.

1.6 The Company has no subsidiaries and does not own any shares or other securities in any other company or entity, and has not at any time agreed to acquire any such shares or securities.

1.7 There are no outstanding or threatened claims, disputes, proceedings or investigations involving the Company, and the Sellers are not aware of any circumstances which are likely to give rise to any of the foregoing.

PART 2 — ACCOUNTS AND FINANCIAL

2.1 The Accounts (being the audited accounts of the Company for the financial year ended 31 March 2025) have been prepared in accordance with applicable law and UK GAAP and give a true and fair view of the state of affairs of the Company as at the Accounts Date and of the profit or loss of the Company for the financial year ended on the Accounts Date.

2.2 The Accounts are not affected by any unusual, extraordinary, exceptional or non-recurring items.

2.3 The Accounts make full provision for or, where appropriate, full disclosure of all liabilities (whether actual, contingent or otherwise) of the Company as at the Accounts Date.

2.4 Since the Accounts Date:
(a) the business of the Company has been carried on in the ordinary and usual course;
(b) there has been no material adverse change in the financial position, assets, liabilities or prospects of the Company;
(c) the Company has not declared, made or paid any dividend or other distribution;
(d) the Company has not acquired or disposed of, or agreed to acquire or dispose of, any material asset;
(e) the Company has not incurred or committed to any capital expenditure in excess of £25,000 in aggregate;
(f) no debts owed to the Company have been released, deferred, subordinated or written off other than in the ordinary course of business;
(g) the Company has not borrowed any money or incurred any indebtedness other than in the ordinary course of business;
(h) no management charges have been levied on the Company by the Sellers or any person connected with the Sellers.

2.5 The Company has no outstanding loan capital, borrowings or indebtedness in the nature of borrowings other than as disclosed in the Accounts.

2.6 The Company's debtors as shown in the Accounts or arising since the Accounts Date have realised or will realise in the ordinary course of collection their full face value.

PART 3 — TAX

3.1 The Company has duly and punctually paid all Tax which it has become liable to pay and is under no liability to pay any penalty, surcharge, fine or interest in connection with any Tax.

3.2 All returns, computations, notices, accounts and other documents and information which are or have been required to be submitted by the Company to any Tax Authority have been submitted on a proper basis, on a timely basis and are up to date, correct and complete in all material respects.

3.3 The Company is not, and has not within the last four years been, involved in any dispute with any Tax Authority and there are no circumstances which are likely to give rise to any such dispute.

3.4 The Company has maintained proper and up-to-date records as required by law in relation to Tax, including records relating to VAT and PAYE.

3.5 The Company is registered for VAT and has at all times complied with all statutory requirements, orders, provisions, directions and conditions relating to VAT.

3.6 All documents in the possession or under the control of the Company which attract stamp duty or stamp duty land tax have been properly stamped within the requisite period.

3.7 The Company has not entered into any transaction, scheme or arrangement the main purpose or one of the main purposes of which was the avoidance of, or the reduction in the liability to, Tax.

PART 4 — ASSETS AND CONTRACTS

4.1 The Company is the sole legal and beneficial owner of all assets shown in the Accounts or acquired since the Accounts Date, free from all charges, liens, encumbrances, mortgages, pledges, options, equities or claims of any kind.

4.2 All plant, machinery, equipment and vehicles owned or used by the Company are in a reasonable state of repair and condition.

4.3 The assets of the Company comprise all assets necessary for the continuation of the business of the Company as carried on at the date of this Agreement.

4.4 Full and accurate details of all material contracts to which the Company is a party have been disclosed to the Buyer. A "material contract" means any contract: (a) which cannot be terminated on 3 months' notice or less; (b) which involves expenditure >£50,000 pa; (c) which involves income >£50,000 pa; (d) which is otherwise material to the business.

4.5 The Company is not in breach of, and has not received any notice of breach or termination in respect of, any material contract.

4.6 No material contract is subject to any dispute, and no party has given notice of any intention to terminate any such contract.

PART 5 — PROPERTY

5.1 The particulars of each Property as set out in Schedule 5 are true, complete and accurate.

5.2 The Company has good and marketable title to each Property.

5.3 There are no outstanding material disputes relating to any Property.

5.4 The Company has complied in all material respects with all obligations under any lease relating to any Property.

5.5 All necessary planning permissions, building regulation approvals and other consents required for the current use of the Properties have been obtained.

5.6 The Company has not received any notice from any authority or third party which adversely affects any Property.

5.7 No Property is subject to any restrictive covenant or encumbrance which materially affects its current use or value.

PART 6 — EMPLOYEES AND PENSIONS

6.1 Full and accurate details of all employees have been disclosed to the Buyer.

6.2 The Company has complied in all material respects with all applicable employment legislation.

6.3 There are no outstanding or threatened claims by any employee or former employee.

6.4 No employee has given or received notice of termination.

6.5 The Company is not party to any collective agreement with any trade union.

6.6 There are no amounts owing to any current or former employee other than current pay period remuneration and accrued holiday pay.

6.7 Full and accurate details of all pension schemes have been disclosed. All contributions have been duly paid.

6.8 No employee is subject to a restrictive covenant that would prevent them performing their current duties.

PART 7 — INTELLECTUAL PROPERTY

7.1 Full and accurate details of all Company IP have been disclosed.

7.2 The Company is the sole legal and beneficial owner of all Company IP, free from all third-party rights.

7.3 No Company IP is the subject of any claim, challenge or dispute.

7.4 The Company has not infringed any third party's IP rights.

7.5 The Company has taken all reasonable steps to protect and maintain Company IP.

PART 8 — REGULATORY AND COMPLIANCE

8.1 The Company holds all licences, permits, authorisations and consents necessary for carrying on its business.

8.2 The Company has complied in all material respects with all applicable laws and regulations.

8.3 The Company has complied in all material respects with UK GDPR and the Data Protection Act 2018.

8.4 The Company has not been the subject of any investigation or enforcement action by any regulatory authority.

PART 9 — INSURANCE

9.1 Full and accurate details of all insurance policies have been disclosed.

9.2 All premiums have been duly paid and all policies are in full force and effect.

9.3 The Company has not done anything which would entitle an insurer to avoid or refuse any claim.

9.4 There are no outstanding insurance claims and no circumstances likely to give rise to any claim.

PART 10 — ENVIRONMENTAL

10.1 The Company has at all material times complied with all Environmental Laws.

10.2 The Company holds all environmental permits, licences and authorisations necessary for its business.

10.3 There has been no discharge, release, spillage, leak, emission or escape of any Hazardous Substance at, on, under or from any Property.

10.4 The Company has not received any notice, complaint or communication relating to breach of Environmental Laws or contamination.

10.5 There are no Environmental Liabilities which have been incurred but not discharged.`

const SPA_IDEAL_DISCLOSURE_TEXT = `DISCLOSURE LETTER

TO: Northgate Industrial Group plc ("the Buyer")
FROM: Michael Chen and Priya Sharma (together, "the Sellers")
DATE: [Date of Agreement]
RE: Share Purchase Agreement relating to the entire issued share capital of Precision Fabrications Limited ("the Company")

1. Introduction

1.1 We refer to the Share Purchase Agreement dated [●] 2026 (the "Agreement") between (1) the Sellers and (2) the Buyer relating to the sale and purchase of the entire issued share capital of the Company. Defined terms used in this letter have the same meaning as in the Agreement unless otherwise stated.

1.2 This letter constitutes the Disclosure Letter for the purposes of the Agreement. It is given by the Sellers to the Buyer in connection with the Warranties set out in Schedule 4 of the Agreement.

1.3 The Sellers make the following general disclosures and specific disclosures against the Warranties.

2. General Disclosures

2.1 The following are disclosed generally against all Warranties:

(a) All information contained or referred to in the documents listed in the attached Disclosure Bundle (copies of which have been provided to the Buyer or its advisers).

(b) All matters which would be revealed by:
   (i) a search of the Company's file at Companies House;
   (ii) a search of the registers maintained by the Land Registry in respect of the Properties;
   (iii) searches at the Central Registry of Winding-up Petitions;
   (iv) a search of the register maintained by the Financial Conduct Authority.

(c) All matters contained or referred to in the audited accounts of the Company for the three financial years ended 31 March 2023, 31 March 2024 and 31 March 2025.

(d) All matters which are within the actual knowledge of the Buyer's officers, employees and professional advisers as at the date of this letter.

3. Specific Disclosures

Against Warranty 1.4 — Constitutional Documents

Disclosure 1: The Company's articles of association were amended in 2014 to remove a pre-emption clause on share transfers. A special resolution was passed to effect this amendment. The Sellers are in the process of locating the signed copy of the special resolution and will provide it to the Buyer as soon as it is available.

Disclosure 2: There is a shareholders' agreement between Michael Chen and Priya Sharma dated 2012 which governs certain aspects of the relationship between the Sellers, including tag-along and drag-along rights and the allocation of management responsibilities. A copy is included in the Disclosure Bundle at tab 3. The Sellers note that certain provisions relating to management responsibilities have not been strictly followed in practice.

Against Warranty 1.7 — Claims, Disputes and Proceedings

Disclosure 3: The matters disclosed against Warranties 4.5/4.6 (Midlands Motor Parts claim), Warranty 6.3 (Tom Griffiths personal injury and Karen White unfair dismissal), Warranty 3.3 (HMRC R&D tax credit enquiry) and Warranty 10.4 (Environment Agency drainage notice) below are also disclosed against this Warranty.

Against Warranty 2.2 — Unusual or Non-Recurring Items

Disclosure 4: The Accounts for the year ended 31 March 2025 include within trade debtors a debt of £85,000 owed by Hartwell Automotive Ltd. Hartwell Automotive entered into a Company Voluntary Arrangement (CVA) in November 2025. The administrators have indicated that unsecured creditors are likely to receive between 15p and 25p in the pound. No provision or write-down has been made for this debt in the Accounts.

Against Warranty 2.3 — Provision for Liabilities

Disclosure 5: The Hartwell Automotive debt referred to in Disclosure 4 above has not been provisioned for or written down in the Accounts, notwithstanding the subsequent CVA.

Against Warranty 2.4(a) — Business in Ordinary Course

Disclosure 6: Linda Chen (wife of Michael Chen) provides bookkeeping services to the Company on a freelance basis and invoices £2,000 per month (£24,000 per annum). This is a related party transaction which is not disclosed in the Accounts.

Against Warranty 2.4(c) — No Dividends

Disclosure 7: The Company declared and paid an interim dividend of £50,000 in August 2025 (£30,000 to Michael Chen and £20,000 to Priya Sharma).

Against Warranty 2.4(e) — Capital Expenditure

Disclosure 8: In June 2025, the Company purchased a new CNC milling machine for £78,000, funded from operating cash flow. This exceeds the £25,000 aggregate threshold for capital expenditure since the Accounts Date.

Against Warranty 2.5 — Borrowings and Indebtedness

Disclosure 9: The Company has an overdraft facility of £100,000 with Barclays Bank plc, secured by a floating charge over the Company's assets. The current balance drawn on the facility is nil. The facility and the floating charge remain in place.

Against Warranty 2.6 — Debtors

Disclosure 10: The Hartwell Automotive debt of £85,000 referred to in Disclosures 4 and 5 above is unlikely to be recovered at face value given the CVA. Recovery is estimated at between 15% and 25% of the face value.

Against Warranty 3.1 — Payment of Tax / Penalties

Disclosure 11: In 2022, the Company received a penalty of £15,000 from HMRC for late filing of a PAYE Real Time Information (RTI) return. The Company appealed and £10,000 was refunded. The remaining £5,000 penalty was paid in full.

Against Warranty 3.3 — Disputes with Tax Authorities

Disclosure 12: The Company received a compliance check notice from HMRC in September 2025 in respect of Research and Development (R&D) tax credit claims for the financial years ended 31 March 2023 and 31 March 2024, with a combined value of approximately £95,000. HMRC has requested further information and supporting documentation. The enquiry is ongoing and no assessment or adjustment has been made to date. The claims were prepared by the Company's accountants, BDH Associates.

Against Warranty 3.5 — VAT

Disclosure 13: The Company has zero-rated certain supplies to Fitzpatrick Engineering Ltd (a customer in the Republic of Ireland) on the basis that these are exports. The Company is unable to confirm at this time whether it holds all the documentary evidence required to support the zero-rating.

Against Warranty 4.4 — Material Contracts

Disclosure 14: Full details of the Company's material contracts are provided in the Disclosure Bundle. The key material contracts are:

(a) Supply agreement with Jaguar Land Rover (JLR) — rolling term, 6 months' notice, annual value approximately £1.2 million. This contract contains a change of control clause entitling JLR to terminate on 30 days' notice in the event of a change of ownership of the Company. The Sellers have not yet discussed the transaction with JLR.

(b) Supply agreement with Rolls-Royce Holdings plc — fixed 3-year term expiring September 2027, annual value approximately £680,000. Requires maintenance of AS9100 certification.

(c) Supply agreement with Steelco UK Ltd — rolling term, 3 months' notice, annual value approximately £450,000. Steelco has notified the Company of a 12% price increase to take effect from April 2026.

(d) Supply agreement with Apex Tooling Solutions — rolling term, 1 month's notice, annual value approximately £120,000.

Against Warranties 4.5 and 4.6 — Breach of Contract / Disputes

Disclosure 15: In October 2025, the Company received a letter of complaint from Midlands Motor Parts Ltd alleging defective components and claiming approximately £42,000 in damages. The Company disputes the claim. No legal proceedings have been issued.

Against Warranty 5.4 — Compliance with Lease Obligations

Disclosure 16: In 2023, the Company constructed an internal mezzanine floor within Unit 12 to create additional storage space. The Company obtained verbal approval from the landlord's property manager but did not obtain formal written consent under the lease. Building regulations approval was not obtained for the mezzanine works.

Against Warranty 5.5 — Planning and Building Regulation Approvals

Disclosure 17: The mezzanine floor constructed in 2023 referred to in Disclosure 16 above was built without building regulations approval. The Sellers are unable to confirm whether building regulations approval was required for the works.

Against Warranty 5.6 — Notices Affecting Property

Disclosure 18: In March 2025, the Company received a copy of a notice from the Environment Agency addressed to the landlord regarding the condition of the surface water drainage system on the estate. The landlord has been dealing with this matter. The Company has not received any follow-up notice addressed specifically to it.

Against Warranty 5.3 — Property Disputes

Disclosure 19: The rent review under the lease of Unit 12 has been triggered by the landlord as at 1 January 2025 but has not yet been concluded. The landlord is seeking an increase from £85,000 to £105,000 per annum. The Company's surveyor considers fair market rent to be £92,000–£95,000.

Against Warranty 6.1 — Employee Details

Disclosure 20: A full employee list is enclosed in the Disclosure Bundle. David Liu (Operations Director) has a contractual entitlement to a 5% share of annual profits.

Against Warranty 6.3 — Employee Claims

Disclosure 21: Tom Griffiths (Senior CNC Operator) has been on long-term sick leave since August 2025 following a back injury at work in July 2025. He has indicated he intends to bring a personal injury claim. Aviva has been notified.

Disclosure 22: Karen White brought an unfair dismissal claim which was settled via ACAS for £8,500 in July 2025. A COT3 was signed.

Against Warranty 6.4 — Notice of Termination

Disclosure 23: David Liu has expressed dissatisfaction at being excluded from the sale proceeds. While he has not given formal notice, this may affect retention post-completion.

Against Warranty 6.7 — Pensions

Disclosure 24: The Company was approximately two months late in auto-enrolling three new employees in 2024. The Pensions Regulator issued a compliance notice. The issue has been resolved.

Against Warranty 8.2 — General Compliance

Disclosure 25: The Company does not have a formal employee handbook or written policies covering disciplinary procedures, grievance procedures, equal opportunities, or data protection in the employment context.

Against Warranty 7.3 — IP Claims and Disputes

Disclosure 26: In 2024, Atlas Components Ltd was observed marketing similar component designs. The Company decided against legal action. No formal claims were made by either party. Atlas has ceased marketing the similar products.

Against Warranty 7.5 — Protection of IP

Disclosure 27: The UK trade mark "PRECISION FABRICATIONS" (UK00003456789) is due for renewal in July 2026.

Disclosure 28: Sarah Okonkwo (Design Engineer) developed component designs during employment. The IP assignment clause in her contract may not be properly drafted or fully effective.

Against Warranty 8.1 — Licences and Authorisations

Disclosure 29: The AS9100 Rev D audit in May 2025 raised two minor non-conformances. The Company addressed these but cannot currently locate the close-out documentation.

Against Warranty 8.3 — Data Protection

Disclosure 30: The Company does not have a written data protection policy, a privacy notice for employees, or a data processing register. It has not appointed a DPO or carried out a DPIA. No breaches or complaints have been reported.

Against Warranty 9.4 — Insurance Claims

Disclosure 31: The Tom Griffiths matter has been notified to Aviva. Loss adjusters have been appointed. No settlement has been reached.

Against Warranty 9.1 — Insurance Policies

Disclosure 32: The Company does not carry cyber insurance or D&O insurance.

Against Warranty 10.3 — Discharge of Hazardous Substances

Disclosure 33: In 2021, there was a spillage of approximately 50 litres of cutting oil in the yard area. The spillage was contained and cleaned up. The Environment Agency was not notified.

Against Warranty 10.2 — Environmental Permits

Disclosure 34: The Company does not hold an environmental permit. The Company's accountants have advised that operations fall below the relevant thresholds, but this has not been formally verified.

Against Warranty 10.4 — Environmental Notices

Disclosure 35: The EA drainage notice referred to in Disclosure 18 is also disclosed against this Warranty.

4. Disclosure Bundle Index

Tab 1: Certificate of Incorporation
Tab 2: Current articles of association
Tab 3: Shareholders' agreement dated 2012
Tab 4: Audited accounts (year ended 31 March 2025)
Tab 5: Audited accounts (year ended 31 March 2024)
Tab 6: Audited accounts (year ended 31 March 2023)
Tab 7: Barclays Bank overdraft facility letter and floating charge
Tab 8: HMRC compliance check notice — R&D tax credits (September 2025)
Tab 9: JLR supply agreement
Tab 10: Rolls-Royce supply agreement
Tab 11: Steelco UK supply agreement (including price increase notice)
Tab 12: Apex Tooling Solutions supply agreement
Tab 13: Lease of Unit 12, Riverside Industrial Estate
Tab 14: Midlands Motor Parts complaint letter (October 2025)
Tab 15: Environment Agency drainage notice (March 2025)
Tab 16: Full employee list with terms
Tab 17: David Liu — contract of employment
Tab 18: Tom Griffiths — Aviva claim notification
Tab 19: Karen White — COT3 agreement
Tab 20: Pensions Regulator compliance notice (2024)
Tab 21: Sarah Okonkwo — contract of employment
Tab 22: UK trade mark registration certificates
Tab 23: AS9100 Rev D certificate and most recent audit report
Tab 24: ISO 9001:2015 certificate
Tab 25: Insurance policy schedules (all current policies)
Tab 26: Waste transfer notes (current)
Tab 27: Health and Safety policy (2019)
Tab 28: RIDDOR reports (2024 and 2025)

Signed:

Michael Chen
Priya Sharma
Date: [●] 2026`

const SPA_IDEAL_MEMO_TEXT = `INTERNAL MEMO — CONFIDENTIAL

To: James Harrington, Partner
From: [Trainee Solicitor]
Date: [Date]
Re: Precision Fabrications Limited — Sale to Northgate Industrial Group plc — Issues and Follow-Up Items

1. Purpose

This memo sets out concerns and follow-up items arising from my review of the draft SPA warranties and the client background information, prepared in connection with the Disclosure Letter.

2. High Priority — Potential Deal Issues

2.1 JLR Change of Control Clause

The JLR supply agreement (largest customer, c.£1.2m/year) contains a change of control clause allowing JLR to terminate on 30 days' notice. Michael has not yet spoken to JLR about the sale.

Risk: If JLR exercises this right, it would remove approximately 32% of the Company's turnover. This is likely to be a significant concern for the Buyer and could affect the purchase price or deal structure.

Recommended action: Discuss with the client whether to approach JLR before or after exchange. The Buyer may want completion conditional on JLR confirming it will not exercise the right, or seek a price retention / earn-out mechanism.

2.2 Hartwell Automotive Debt — £85,000

This debt is included at face value in the Accounts but recovery is estimated at 15–25% given the CVA. The likely shortfall is £64,000–£72,000.

Risk: This will feature in the completion accounts adjustment. If not properly disclosed, it could give rise to a warranty claim under Warranties 2.3 and 2.6.

Recommended action: We have disclosed this fully. The Sellers should be advised that the completion accounts will likely reflect a significant write-down.

2.3 HMRC R&D Tax Credit Enquiry

HMRC is investigating R&D claims totalling c.£95,000. The enquiry is ongoing.

Risk: If HMRC disallows the claims, the Company could face a tax liability of up to £95,000 plus interest and potential penalties. The Buyer will likely seek a specific indemnity.

Recommended action: Obtain copies of the R&D claims from BDH Associates and review them. Anticipate the Buyer seeking a specific tax indemnity or retention from the purchase price.

2.4 David Liu — Retention Risk

David Liu (Operations Director) is unhappy about being excluded from the sale proceeds. He has a 12-month non-compete.

Risk: David is a key employee. His departure could affect operational continuity. The Buyer will be concerned about this.

Recommended action: Discuss with the client whether to offer David an incentive (completion bonus or retention payment). The Buyer may require David to enter into new restrictive covenants.

3. Medium Priority — Legal Compliance Gaps

3.1 Mezzanine Floor — No Landlord Consent or Building Regs

The mezzanine was built in 2023 without formal written landlord consent or building regulations approval.

Risk: The landlord could require reinstatement. Lack of building regs approval could create issues with insurers or HSE.

Recommended action: Advise the client to approach the landlord for retrospective consent. Instruct a building surveyor to advise on whether building regulations approval was required and obtain a regularisation certificate.

3.2 Data Protection Non-Compliance

No written data protection policy, no employee privacy notice, no data processing register, no DPO assessment.

Risk: Not compliant with UK GDPR. Creates regulatory risk and potential warranty claim under Warranty 8.3.

Recommended action: Recommend the client prepares the necessary documentation before completion. At minimum: privacy notice for employees and a basic data processing register.

3.3 VAT Zero-Rating — Missing Documentation

The Company may not hold the evidence required to support zero-rating of supplies to Fitzpatrick Engineering.

Risk: If HMRC investigates and the Company cannot produce evidence of export, VAT could be assessed at the standard rate.

Recommended action: Ask the client to investigate urgently. If documentation cannot be found, consider the quantum of potential VAT exposure and whether a specific indemnity is appropriate.

4. Lower Priority — Documentation Gaps to Close

- Special resolution re 2014 articles amendment — client to locate and provide
- AS9100 non-conformance close-out evidence — client to obtain from auditor
- Sarah Okonkwo IP assignment clause — review her contract; consider confirmatory IP assignment deed
- Environmental permit position — obtain formal confirmation on whether a permit is required
- 2021 oil spillage notification obligation — take environmental law advice on whether the spillage should have been reported
- Trade mark renewal (July 2026) — diary for renewal, ensure Buyer is aware

5. Anticipated Buyer Requests

1. Specific indemnity for the HMRC R&D tax credit enquiry
2. Retention from purchase price or escrow for the Hartwell debt and/or R&D enquiry
3. Comfort on JLR — condition precedent or price adjustment mechanism
4. Condition requiring resolution of the mezzanine issue
5. Condition or undertaking regarding David Liu's retention
6. Undertaking to implement data protection compliance measures
7. Enquiries on the Midlands Motor Parts claim, outstanding rent review, and environmental matters

6. Summary

The JLR change of control clause, the Hartwell debt, and the HMRC enquiry are the three issues most likely to affect the commercial terms. The compliance gaps (data protection, H&S, employee handbook) are less likely to derail the deal but will be flagged in due diligence and may result in additional undertakings or conditions.

I would welcome your guidance on which items to progress first.

[Trainee Solicitor]`

const SPA_EXERCISE_MARKDOWN = `# SPA Disclosure Letter — Training Exercise

## Background

You are a trainee solicitor in the corporate department of a City law firm. Your supervising partner, James Harrington, has assigned you to work on the sale of **Precision Fabrications Limited** to **Northgate Industrial Group plc** for **£4.2 million**.

Precision Fabrications manufactures precision metal components for the automotive and aerospace industries. The Sellers — Michael Chen and Priya Sharma — are selling 100% of the issued share capital.

The Buyer's solicitors have sent across a draft Share Purchase Agreement which includes an extensive warranties schedule. Your task is to prepare the Disclosure Letter and an internal memo.

## Your Role

You have been asked to:

1. **Review** the SPA Warranties Schedule and the Client Background Information Pack
2. **Draft a Disclosure Letter** against the warranties, identifying which facts give rise to disclosures and referencing the correct warranty numbers
3. **Draft an internal memo** to the supervising partner flagging concerns, follow-up items, and anticipated Buyer requests

## Documents Provided

- **SPA Warranties Schedule** — The draft warranties from the Buyer's solicitors that you must disclose against
- **Client Background Information Pack** — Detailed factual information from the supervising partner's meeting with the client

## Key Areas of Law

- Company law and corporate governance
- Contract law (material contracts, change of control)
- Employment law (claims, redundancy, restrictive covenants)
- Tax (R&D credits, PAYE, VAT)
- Property (commercial leases, building regulations)
- Data protection (UK GDPR, DPA 2018)
- Environmental law
- Insurance
- Intellectual property

## How This Exercise Works

1. **Step 1 — Review:** Read both documents carefully. Identify which facts are relevant to which warranties.
2. **Step 2 — Disclosure Letter:** Draft a complete disclosure letter with general disclosures, specific disclosures (referenced to warranty numbers), and a disclosure bundle index.
3. **Step 3 — Internal Memo:** Draft a memo to the supervising partner flagging key issues, recommending actions, and anticipating the Buyer's response.

You may ask questions at any time using the chat panel — this simulates asking your supervising partner for guidance. Your questions will be assessed for relevance and quality.

## Tips

- **When in doubt, disclose.** The Sellers are personally liable for warranty claims. Over-disclosure is safer than under-disclosure.
- **Cross-reference.** A single fact may be relevant to multiple warranties — make sure you disclose against all relevant ones.
- **Be precise.** Include dates, amounts, names and circumstances. Vague disclosures are weak disclosures.
- **Exercise judgment.** Not every fact needs disclosing. The exercise tests your ability to distinguish between disclosable matters and background information.
- **Think commercially.** The memo should analyse how issues affect the deal, not just list legal compliance points.

**Take your time.** This exercise is designed to take 6–8 hours, simulating a full working day on a corporate transaction. Quality and thoroughness matter more than speed.

---

*Good luck!*`

// ============================================================
// Witness Statement Drafting Exercise
// ============================================================

function buildWitnessStatementExercise(): Exercise {
  const now = new Date().toISOString()

  const exercise: Exercise = {
    id: WITNESS_ID,
    title: 'Witness Statement Drafting — CMA Price-Fixing Investigation',
    description: 'Draft a witness statement from a rambling, unstructured witness account for use in a CMA competition law investigation. Handle hearsay, opinion evidence, and CPR compliance. Produce a covering memo flagging issues and follow-up questions.',
    matterType: 'Civil Litigation — Witness Statement / Competition Law',
    difficulty: 'mid',
    estimatedDurationMinutes: 480,
    documents: [
      {
        id: WS_DOC_IDS.caseSummary,
        exerciseId: WITNESS_ID,
        filename: 'case_summary.md',
        mimeType: 'text/markdown',
        role: 'instruction',
        label: 'Case Summary — Background Note',
        extractedText: WS_CASE_SUMMARY_TEXT,
        uploadedAt: now,
      },
      {
        id: WS_DOC_IDS.instructionEmail,
        exerciseId: WITNESS_ID,
        filename: 'instruction_email.md',
        mimeType: 'text/markdown',
        role: 'instruction',
        label: 'Instruction Email from Sarah Thornton (Partner)',
        extractedText: WS_INSTRUCTION_EMAIL_TEXT,
        uploadedAt: now,
      },
      {
        id: WS_DOC_IDS.witnessTranscript,
        exerciseId: WITNESS_ID,
        filename: 'witness_transcript.md',
        mimeType: 'text/markdown',
        role: 'source-material',
        label: 'Attendance Note — Call with Daniel Kershaw (Witness)',
        extractedText: WS_WITNESS_TRANSCRIPT_TEXT,
        uploadedAt: now,
      },
      {
        id: WS_DOC_IDS.supportingDocs,
        exerciseId: WITNESS_ID,
        filename: 'supporting_documents_bundle.md',
        mimeType: 'text/markdown',
        role: 'source-material',
        label: 'Supporting Documents Bundle (DK/1–DK/4)',
        extractedText: WS_SUPPORTING_DOCS_TEXT,
        uploadedAt: now,
      },
      {
        id: WS_DOC_IDS.idealStatement,
        exerciseId: WITNESS_ID,
        filename: 'ideal_witness_statement.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Witness Statement',
        extractedText: WS_IDEAL_STATEMENT_TEXT,
        uploadedAt: now,
      },
      {
        id: WS_DOC_IDS.idealMemo,
        exerciseId: WITNESS_ID,
        filename: 'ideal_covering_memo.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Covering Memo to Supervisor',
        extractedText: WS_IDEAL_MEMO_TEXT,
        uploadedAt: now,
      },
      {
        id: WS_DOC_IDS.feedbackTemplate,
        exerciseId: WITNESS_ID,
        filename: 'supervisor_feedback_template.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Supervisor Feedback Template',
        extractedText: WS_FEEDBACK_TEMPLATE_TEXT,
        uploadedAt: now,
      },
    ],
    steps: [
      {
        id: 'step-1',
        order: 1,
        title: 'Receive the Instruction',
        instruction: `You are a trainee solicitor in the Competition & Regulatory department at Blackwell Harte LLP. Your supervising partner, Sarah Thornton, has emailed you an urgent task.

**Your task:** Read the case summary and Sarah's instruction email carefully. Understand:
- The nature of the investigation and who the parties are
- What Daniel Kershaw is being called to address
- Sarah's specific instructions about how to approach the statement
- The deadline and deliverables

When you are ready, mark this step as complete. You may ask questions using the chat — treat it as Sarah Thornton.`,
        type: 'read',
        visibleDocuments: [WS_DOC_IDS.caseSummary, WS_DOC_IDS.instructionEmail],
        idealOutput: null,
        gradingCriteria: [],
        maxScore: 0,
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Review Witness Material & Produce Planning Note',
        instruction: `You now have access to the raw witness transcript (attendance note from the call with Daniel Kershaw) and the supporting documents bundle.

**Your task:** Review all materials and produce a planning note (bullet points are fine) setting out:

1. **Key facts** the witness can give direct evidence about
2. **Exhibits** — which supporting documents should be exhibited and why
3. **Hearsay evidence** identified — what is hearsay, who is the original source, and is it necessary?
4. **Opinion evidence** identified — what should be excluded and what (if anything) can stay?
5. **Irrelevant material** to strip out
6. **Gaps, contradictions, or problems** in the account
7. **Follow-up questions** to go back to the witness with

Be thorough — this planning note demonstrates your ability to analyse raw material before drafting.`,
        type: 'identify',
        visibleDocuments: [WS_DOC_IDS.caseSummary, WS_DOC_IDS.instructionEmail, WS_DOC_IDS.witnessTranscript, WS_DOC_IDS.supportingDocs],
        idealOutput: `Key Facts (Direct Evidence):
- DK's role at Granville (March 2019–August 2025), reporting line, pricing authority
- Pricing structure at Granville — centrally set by Fiona Ashworth, DK had up to 8% discount discretion only
- 2023 Trade Forum drinks reception conversation — Rob Gallagher (Kerrfield) and Nish Patil (Oakhurst) discussing price alignment
- WhatsApp group "Adhesives Lads" — created 3 November 2023 by Rob Gallagher
- 15 January 2024 WhatsApp message — RG disclosed Kerrfield pricing, Nish Patil indicated Oakhurst would follow
- 24 June 2024 WhatsApp message — Nish Patil disclosed Oakhurst price revision
- DK did not post any pricing information in the group
- Contemporaneous Post-it note made 15 January 2024
- Granville's March 2024 price increase — Fiona Ashworth email with cost justifications
- 2024 Trade Forum conversation — RG comment about being "on the same page"
- DK's failure to report the WhatsApp group
- Resignation August 2025, journalist contact refused

Exhibits:
- DK/1: WhatsApp screenshots — critical direct evidence
- DK/2: Trade Forum 2024 attendee list — corroborates attendance
- DK/3: Fiona Ashworth and Mike Stanton emails — independent pricing justification
- DK/4: Post-it note photograph — corroborates account

Hearsay:
- Customer reports (Dave Barton, Jenny Okonkwo) — hearsay, sources identified, consider whether necessary given WhatsApp evidence
- Tom Brightman / Gallagher dismissal — double hearsay, EXCLUDE
- Jenny Okonkwo complaint — vague, unverifiable, EXCLUDE

Opinion to Remove:
- Rob Gallagher "a bit drunk" — opinion on intoxication
- Fiona Ashworth "very data-driven" — character opinion
- "Probably a coincidence" — speculation

Irrelevant Material:
- House move, wife's relocation, baby Lucy, Travis Perkins detail
- Rob Gallagher being a Liverpool fan, memes, polymer keynote

Gaps / Problems:
- Forwarded email to personal address — unexplained
- Nish's surname uncertain (attendee list confirms Patil)
- WhatsApp screenshot completeness
- DK's continued group membership after seeing pricing messages

Follow-up Questions:
1. 2023 Trade Forum dates — DK has the programme
2. Confirm Nish Patil's name
3. Marcus Webb's full name and role
4. Why forwarded pricing email to personal email?
5. Is WhatsApp group still active? More messages?
6. Original Post-it note — still available?
7. Screenshots complete?
8. Any other competitor conversations at Trade Forum?
9. Jenny Okonkwo — who did she complain to?`,
        gradingCriteria: [
          'Identifies all key facts DK can give direct evidence about (role, pricing structure, Trade Forum conversations, WhatsApp messages, failure to report, resignation, journalist contact)',
          'Correctly identifies all four documents as potential exhibits with reasoning for each',
          'Identifies customer pricing reports (Dave Barton, Jenny Okonkwo) as hearsay with source attribution',
          'Identifies Tom Brightman / Gallagher dismissal as double hearsay — recommends exclusion',
          'Identifies Jenny Okonkwo complaint as vague hearsay — recommends exclusion or separate investigation',
          'Identifies Rob Gallagher intoxication as inadmissible opinion — recommends exclusion',
          'Identifies Fiona Ashworth "data-driven" as character opinion — recommends exclusion',
          'Identifies "probably a coincidence" as speculation — recommends exclusion',
          'Identifies irrelevant personal material (house move, wife, baby, Travis Perkins detail)',
          'Flags the forwarded email to personal address as unexplained and potentially problematic',
          'Flags completeness of WhatsApp screenshots as an issue',
          'Flags DK\'s continued group membership as a problem for Granville',
          'Proposes sensible follow-up questions (at least 5 substantive questions)',
          'Demonstrates understanding of what hearsay notice would be needed under CPR Part 33',
        ],
        maxScore: 15,
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Draft Witness Statement',
        instruction: `Now draft Daniel Kershaw's witness statement.

**Your task:** Produce a full witness statement compliant with CPR Part 32 and Practice Direction 32A. The statement must include:

1. **Heading** — correct matter reference, parties, witness name, statement number
2. **Opening paragraph** — full name, address (known to solicitor), occupation, relationship to proceedings, confirmation of own knowledge with information/belief distinction
3. **Body** — structured chronologically in numbered paragraphs, in the first person, in the witness's own language
4. **Hearsay handling** — any hearsay clearly identified with source and basis for belief
5. **Opinion evidence** — excluded unless within a permitted exception
6. **Exhibit references** — correctly formatted (DK/1, DK/2 etc.) with explanation of what each document shows
7. **Statement of truth** — prescribed form
8. **Exhibit list**

**Key reminders from Sarah:**
- This may end up before the CMA — it needs to be right
- Clearly distinguish direct evidence from information and belief
- Strip out opinion and irrelevant personal material
- Be careful — this witness's evidence is both helpful and harmful to the client`,
        type: 'draft',
        visibleDocuments: [WS_DOC_IDS.caseSummary, WS_DOC_IDS.instructionEmail, WS_DOC_IDS.witnessTranscript, WS_DOC_IDS.supportingDocs],
        idealOutput: WS_IDEAL_STATEMENT_TEXT,
        gradingCriteria: [
          'CPR Compliance: Correct heading with matter reference, parties, case number (3pts)',
          'CPR Compliance: Opening paragraph with full name, address known to solicitor, occupation, relationship to proceedings (2pts)',
          'CPR Compliance: Information and belief distinction clearly stated in opening paragraph (2pts)',
          'CPR Compliance: Numbered paragraphs throughout (1pt)',
          'CPR Compliance: First person, witness\'s own language (2pts)',
          'CPR Compliance: Correct statement of truth in prescribed form (2pts) — CRITICAL',
          'CPR Compliance: Exhibit list at the end (1pt)',
          'Content: DK\'s role, reporting line, and pricing authority at Granville (2pts)',
          'Content: Pricing structure — centrally set, DK had discount discretion only (2pts)',
          'Content: 2023 Trade Forum conversation with RG and Nish Patil — what was said (3pts)',
          'Content: WhatsApp group creation, membership, and general nature of messages (2pts)',
          'Content: 15 January 2024 pricing message — RG disclosed 5% increase, Nish and Marcus responded (3pts) — CRITICAL',
          'Content: 24 June 2024 pricing message — Nish disclosed Oakhurst pricing, RG responded (2pts)',
          'Content: DK did not post pricing information — only social messages (2pts)',
          'Content: Contemporaneous Post-it note with photo metadata corroboration (2pts)',
          'Content: Granville March 2024 price increase — Fiona Ashworth email with cost justifications (2pts)',
          'Content: Mike Stanton compliance email (1pt)',
          'Content: DK failure to report the WhatsApp group — candid admission (2pts)',
          'Content: 2024 Trade Forum conversation with RG — same page on pricing (2pts)',
          'Content: Senior management knowledge — factual basis stated with appropriate caveat (3pts)',
          'Content: Departure from Granville — unrelated, pre-CMA investigation (1pt)',
          'Content: Journalist contact — refused to comment (1pt)',
          'Hearsay: Customer pricing reports flagged as information and belief with sources identified (3pts) — CRITICAL',
          'Hearsay: Tom Brightman / Gallagher dismissal EXCLUDED as double hearsay (2pts) — CRITICAL',
          'Hearsay: Jenny Okonkwo complaint EXCLUDED or noted as unverifiable (1pt)',
          'Opinion: Rob Gallagher intoxication EXCLUDED (1pt)',
          'Opinion: Probably a coincidence speculation EXCLUDED — replaced with neutral statement (1pt)',
          'Opinion: Fiona data-driven character opinion EXCLUDED — replaced with objective reference to email evidence (1pt)',
          'Opinion: Senior management knowledge opinion RETAINED with factual basis — appropriate judgment call (2pts)',
          'Exhibits: DK/1 (WhatsApp screenshots) correctly exhibited with explanation (1pt)',
          'Exhibits: DK/2 (Trade Forum attendee list) correctly exhibited (1pt)',
          'Exhibits: DK/3 (Fiona Ashworth / Mike Stanton emails) correctly exhibited (1pt)',
          'Exhibits: DK/4 (Post-it note photograph) correctly exhibited (1pt)',
          'Quality: Chronological structure, no jumping between topics (2pts)',
          'Quality: No legal conclusions — penalise if present (2pts)',
          'Quality: No argumentative language (1pt)',
          'Quality: Irrelevant personal material excluded (1pt)',
        ],
        maxScore: 45,
      },
      {
        id: 'step-4',
        order: 4,
        title: 'Draft Covering Memo to Supervisor',
        instruction: `Now draft a memo to Sarah Thornton to accompany your witness statement draft.

**Your task:** Produce a memo covering:

1. **Summary of approach** — how you structured the statement, what you included/excluded
2. **Hearsay analysis** — what hearsay you identified, how you handled it, whether a hearsay notice is needed under CPR Part 33
3. **Opinion evidence** — what you removed and why, any judgment calls you made (especially re: senior management knowledge)
4. **Issues and concerns** — the "lurker" problem, the forwarded email, credibility considerations
5. **Follow-up questions for the witness** — specific, actionable questions
6. **Next steps** — what needs to happen next

This is an internal document — be candid and analytical. Show Sarah you have been thinking, not just typing.`,
        type: 'draft',
        visibleDocuments: [WS_DOC_IDS.caseSummary, WS_DOC_IDS.instructionEmail, WS_DOC_IDS.witnessTranscript, WS_DOC_IDS.supportingDocs],
        idealOutput: WS_IDEAL_MEMO_TEXT,
        gradingCriteria: [
          'Summary of approach taken — explains structure, what was included/excluded and why (2pts)',
          'Hearsay analysis: Identifies customer reports as hearsay, questions whether necessary given WhatsApp evidence (3pts)',
          'Hearsay analysis: Correctly excluded Tom Brightman double hearsay with reasoning (2pts)',
          'Hearsay analysis: Notes Jenny Okonkwo complaint as vague and unverifiable (1pt)',
          'Hearsay analysis: Advises on hearsay notice requirement under CPR Part 33 (2pts)',
          'Opinion analysis: Explains what was removed (RG drunk, Fiona data-driven, coincidence speculation) with reasoning (2pts)',
          'Opinion analysis: Explains judgment call on retaining senior management knowledge opinion with factual basis (2pts)',
          'Flags the lurker issue — DK continued WhatsApp membership is problematic for Granville (2pts)',
          'Flags the forwarded email issue — why did DK send pricing email to personal address? (2pts) — CRITICAL',
          'Flags journalist contact and recommends advising DK not to engage further (1pt)',
          'Follow-up questions: At least 5 substantive, specific questions for the witness (3pts)',
          'Suggests verifying photo metadata / forensic preservation of WhatsApp data (1pt)',
          'Considers whether corroborating statement from DK wife might be useful (1pt)',
          'Next steps are practical and actionable (2pts)',
          'Professional presentation — clear structure, appropriate for internal audience, privileged marking (2pts)',
        ],
        maxScore: 25,
      },
      {
        id: 'step-5',
        order: 5,
        title: 'Review Feedback and Produce Final Draft',
        instruction: `Sarah has reviewed your draft and sent feedback. Review her comments carefully and produce a revised witness statement.

**Your task:**
- Address every point Sarah has raised
- Make the specific corrections she has identified
- Do not introduce new errors
- Where Sarah has asked you to reconsider something, explain your revised approach
- Produce a note alongside the revised statement briefly explaining what you changed and why

This tests whether you can take feedback on board and implement it correctly — a critical skill for any trainee.`,
        type: 'review',
        visibleDocuments: [WS_DOC_IDS.caseSummary, WS_DOC_IDS.instructionEmail, WS_DOC_IDS.witnessTranscript, WS_DOC_IDS.supportingDocs],
        idealOutput: WS_IDEAL_STATEMENT_TEXT,
        gradingCriteria: [
          'All feedback points from supervisor have been addressed (4pts)',
          'Corrections are substantively correct — not just mechanical changes (3pts)',
          'No new errors introduced in the revision (2pts)',
          'Where feedback required judgment, the trainee explains their reasoning (2pts)',
          'The revised statement is closer to the ideal output than the first draft (2pts)',
          'Change note is clear and professional (2pts)',
        ],
        maxScore: 15,
      },
    ],
    rubric: {
      exerciseId: WITNESS_ID,
      overallApproach: 'The trainee should demonstrate the ability to take a raw, rambling witness account and transform it into a properly structured, CPR-compliant witness statement. The key skills tested are: (1) distinguishing direct evidence from hearsay and opinion; (2) handling hearsay correctly under CPR Part 33; (3) excluding inadmissible opinion while retaining permissible opinion with proper basis; (4) structuring the statement chronologically and logically; (5) exhibiting documents correctly; (6) drafting in the witness\'s own voice without being argumentative or including legal conclusions; (7) producing a thoughtful covering memo that demonstrates analytical thinking, not just summarisation.',
      keyIssues: [
        'Customer pricing reports (Dave Barton, Jenny Okonkwo) are hearsay — source must be identified, hearsay notice needed if relied upon',
        'Tom Brightman / Gallagher dismissal is double hearsay — must be excluded entirely',
        'Rob Gallagher "a bit drunk" is inadmissible opinion — must be excluded',
        '"Probably a coincidence" is speculation — must be replaced with neutral factual statement',
        'Fiona Ashworth "very data-driven" is character opinion — must be excluded',
        'Senior management knowledge opinion should be retained but with factual basis and appropriate caveat',
        'Irrelevant personal material must be stripped out',
        'Forwarded email to personal address is unexplained and potentially problematic',
        'DK continued WhatsApp group membership after January 2024 pricing message is a problem for Granville',
        'WhatsApp screenshot completeness must be questioned',
        'Contemporaneous Post-it note and photo metadata need verification',
        'Journalist contact must be included and client advised not to engage further',
        'Statement of truth must be in correct prescribed form',
        'All four documents should be exhibited with correct markers (DK/1 through DK/4)',
        'Hearsay notice requirement under CPR Part 33 should be flagged',
      ],
      criticalErrors: [
        'Including the Tom Brightman / Rob Gallagher dismissal double hearsay in the statement',
        'Failing to identify customer pricing reports as hearsay',
        'Including inadmissible opinion evidence without flagging',
        'Wrong or missing statement of truth',
        'Including legal conclusions (e.g. "this amounted to a concerted practice")',
        'Including irrelevant personal material (house move, wife details)',
        'No exhibit references or incorrectly formatted exhibits',
        'Argumentative tone — statement reads as a submission',
        'Failing to address the senior management knowledge issue',
        'Memo is a summary rather than an analysis',
        'Failing to flag the forwarded email issue in the memo',
      ],
      qualityMarkers: [
        'Correct CPR Part 32 / PD 32A format throughout',
        'Clean separation of direct evidence and information/belief',
        'Hearsay correctly handled — flagged, sourced, hearsay notice identified',
        'Opinion evidence properly filtered',
        'Statement reads in the witness\'s own voice',
        'Chronological structure with clear topic headings',
        'Exhibit references explain what each document shows',
        'Covering memo demonstrates independent analytical thinking',
        'Follow-up questions are specific and actionable',
        'Recognises DK evidence is both helpful and harmful to Granville',
        'Flags forensic preservation of WhatsApp data',
        'Considers corroborating evidence from wife',
      ],
      questionRelevanceGuidance: `Excellent questions (+3 points): "Should we consider whether the customer reports about competitor pricing are actually necessary given we have the WhatsApp messages as direct evidence?" / "Has the WhatsApp data been forensically preserved from DK's device?" / "Should we be taking a statement from DK's wife to corroborate the timing of the Post-it note?"

Good questions (+2 points): "Can you confirm the 2023 Trade Forum dates?" / "Should I address the forwarded email in the statement or just flag it in the memo?" / "How should I handle the section about senior management knowledge — it's opinion but seems important?"

Adequate questions (+1 point): "Should I use the DK/1 exhibit markers from the supporting documents bundle?" / "What format should the statement of truth take?"

Neutral questions (0 points): "How long should the memo be?"

Poor questions (-1 point): "What does CMA stand for?" / "What is Granville's business?" / "Who is the supervising partner?"

Responses:
- Customer hearsay necessity: "Excellent question. The WhatsApp messages are direct evidence and much stronger. Have a think about whether including the hearsay opens up cross-examination we don't want. Include it for now — we can take it out later."
- Forensic preservation: "Good thinking. I'll ask the e-disclosure team to look into it. For now, work with what we have."
- Format: "Draft to CPR Part 32 standard. If it goes to the CMA it'll be adapted, but if there are follow-on damages proceedings we want it ready."
- Senior management knowledge: "That's one of the most important parts. He needs to state the factual basis for his belief, not just assert it. And add a caveat."
- Forwarded email: "Good spot. Don't put it in the statement for now, but flag it prominently in your memo. We need to ask Dan about it."`,
    },
    generatedMarkdown: WS_EXERCISE_MARKDOWN,
    status: 'ready',
    createdAt: now,
    updatedAt: now,
  }

  return exercise
}

// --- Witness Statement Exercise: Embedded Document Texts ---

const WS_CASE_SUMMARY_TEXT = `Case Summary — Background Note

Confidential & Privileged

Matter: Competition and Markets Authority Investigation — Suspected Price-Fixing in the Industrial Adhesives Market
Our Client: Granville Building Supplies Ltd ("Granville")
Matter Reference: CMA/ADH/2025/0342
Supervising Partner: Sarah Thornton
Date: 10 February 2026

Background

The Competition and Markets Authority ("CMA") opened a formal investigation in September 2025 into suspected price-fixing arrangements in the UK industrial adhesives market. The investigation concerns alleged coordination of pricing between three major distributors of industrial adhesives and sealants:

1. Granville Building Supplies Ltd (our client)
2. Kerrfield Distribution Ltd
3. Oakhurst Industrial Products plc

Together these three companies supply approximately 65% of the UK market for industrial adhesives used in the construction and manufacturing sectors.

The CMA's investigation was triggered by a complaint from a trade body representing downstream purchasers (the Construction Materials Buyers Association, "CMBA"), which identified that the three distributors had increased their prices for a core range of adhesive products by near-identical percentages within days of each other on at least four occasions between January 2023 and March 2025.

Our Client's Position

Granville denies participation in any price-fixing arrangement. Granville's position is that its pricing decisions were made independently based on legitimate commercial factors including raw material cost increases from its supplier (Henkel AG) and rising logistics costs.

However, during the course of our internal investigation, we identified a witness — Mr Daniel Kershaw — who was formerly a Regional Sales Manager at Granville (employed March 2019 to August 2025, resigned voluntarily). Mr Kershaw has indicated that he has information relevant to the investigation and is willing to cooperate with Granville's legal team.

Mr Kershaw's account, if accurate, is significant because it suggests that while Granville's senior management did not authorise or direct any price coordination, there may have been informal contact between mid-level sales staff at the three distributors through industry events and a WhatsApp group. Mr Kershaw's evidence is potentially both helpful and harmful to our client.

Key Issues

1. Whether any employees of Granville exchanged competitively sensitive pricing information with employees of Kerrfield or Oakhurst
2. Whether any such exchanges amounted to a concerted practice or agreement within the meaning of Chapter I of the Competition Act 1998
3. Whether Granville's senior management knew of or authorised any such contact
4. The extent of any infringement and Granville's potential exposure to fines and/or damages claims

What the Witness Is Being Called to Address

Mr Kershaw can give evidence about:
- His role at Granville and his involvement in pricing discussions internally
- Industry events where competitors were present (specifically the annual UKIA Trade Forum)
- The existence and content of a WhatsApp group including sales staff from the three distributors
- Specific conversations he witnessed or was party to
- What Granville's senior management knew or did not know

Relevant Regulatory Context

- Chapter I prohibition, Competition Act 1998 (the UK equivalent of Article 101 TFEU)
- CMA's guidance on penalties (CMA73)
- The CMA has powers to impose fines of up to 10% of worldwide turnover
- Granville is considering whether to apply for leniency under the CMA's leniency programme

Status

We are at the internal investigation stage. The CMA has not yet conducted interviews with Granville's personnel. We are taking witness statements from key individuals to understand our client's factual position before responding to the CMA's information request.

This witness statement will be used internally and may ultimately be provided to the CMA as part of a leniency application, subject to further instructions. It is therefore critical that it is accurate, comprehensive, and does not overstate or understate Mr Kershaw's evidence.`

const WS_INSTRUCTION_EMAIL_TEXT = `Email: Instruction to Trainee

From: Sarah Thornton (Partner, Competition & Regulatory) <s.thornton@blackwellharte.com>
To: [Trainee] <trainee@blackwellharte.com>
Date: 10 February 2026, 08:47
Subject: Granville — Witness Statement of Daniel Kershaw — URGENT

Morning,

Please find attached:

1. Background note on the Granville matter (you should have been given access to the data room last week — let me know if not)
2. Transcript of our attendance note from the call with Daniel Kershaw on Friday — Rebecca took this and I should warn you it is fairly rough, Dan is a talker and went off on quite a few tangents
3. Supporting documents — some WhatsApp screenshots Dan sent us, a copy of the UKIA Trade Forum attendee list from 2024, an email chain Dan forwarded from his personal email, and a photo of a handwritten note he says he made at the time

I need you to produce a first draft of Dan's witness statement. This needs to be in proper form — we may end up putting this in front of the CMA so it needs to be right. Key things:

- CPR Part 32 compliant format (I know this isn't litigation yet, but we're drafting to that standard in case it ends up being used in follow-on damages proceedings — the client has been advised on this)
- Please be very careful with hearsay. Dan tells us quite a lot about what other people said and what he heard second-hand. We need to clearly distinguish between what he directly witnessed and what he was told. Flag anything that would need a hearsay notice if this were being used at trial
- There's some opinion in there that needs to come out. Dan has views about what he thinks was going on, but we need facts, not his interpretation
- He goes off on a few personal tangents — obviously strip those out
- Exhibits — think about what we should exhibit. Not everything he's given us will be relevant or helpful

I also need a short memo from you flagging any issues — things that concern you, questions we should go back to Dan with, anything that doesn't add up, and whether you think we need a hearsay notice.

I need the first draft by end of play today. I've got a call with the client tomorrow morning at 9am and I want to have reviewed your draft before then.

Come and find me if you get stuck, but have a proper go at it first.

Thanks,

Sarah

Sarah Thornton | Partner | Competition & Regulatory
Blackwell Harte LLP
DDI: 020 7946 0123 | Mob: 07700 900456

This email is confidential and may be legally privileged. If you have received it in error, please notify the sender immediately and delete it.`

const WS_WITNESS_TRANSCRIPT_TEXT = `Attendance Note — Telephone Call with Daniel Kershaw

Date of call: 7 February 2026
Attending: Rebecca Singh (Associate), Daniel Kershaw (Witness)
Matter: Granville Building Supplies Ltd — CMA Investigation
Ref: CMA/ADH/2025/0342
Note taken by: Rebecca Singh

NOTE: This is a rough attendance note taken during the call. It has not been reviewed or edited. Dan spoke quickly and jumped around a lot. I have tried to capture what he said as faithfully as possible but some of it may be paraphrased. — RS

Right so you want to know everything from the start, yeah? OK so I joined Granville in March 2019, I was a Regional Sales Manager covering the North West and Yorkshire. Before that I was at Travis Perkins for about six years doing a similar role but I left because my wife got a job in Manchester and we relocated, that was a whole thing actually because we'd just had our second kid and the timing was terrible, Lucy was only about four months old and we were trying to sell the house in Reading at the same time. Anyway that's not relevant sorry.

So at Granville my job was basically managing relationships with our key accounts in the region — so that's construction firms, manufacturers, anyone buying industrial adhesives and sealants in bulk. I reported to Mike Stanton who was the National Sales Director. My region was about 15% of Granville's UK sales, something like that, I'd have to check. I had a team of four sales reps under me.

OK so pricing. The way it worked at Granville was that pricing was set centrally by the commercial team — that was led by a woman called Fiona Ashworth, she was Commercial Director. Regional sales managers like me didn't have authority to set list prices but we had discretion on discounts for key accounts, up to I think it was 8%, anything above that had to go to Mike for approval. So I wasn't involved in setting the prices that went out on the price lists, that was Fiona's team.

But here's the thing. I started noticing — and this is probably around mid-2022, maybe a bit earlier, I can't be exact — that whenever we put our prices up, Kerrfield and Oakhurst seemed to do the same thing within a few days. And not just going up, the actual percentages were really similar. Like we'd go up 4.5% on the standard epoxy range and then I'd hear from customers that Kerrfield had gone up 4% or 5% the same week. I remember thinking that was odd but I didn't think much of it at first because to be fair raw material costs were going up for everyone so it could have been coincidence.

Now I should say I didn't see Kerrfield's or Oakhurst's price lists myself. What I'm telling you is what customers told me. So like Dave Barton at Cresswell Construction, he was one of my main accounts, he'd ring me and say "your prices have gone up the same as everyone else's again" and I'd think well yeah, costs are going up. And Jenny Okonkwo at Precision Manufacturing, she said the same thing a few times. I think she actually made a complaint to someone about it but I don't know who. You might want to check that.

Anyway the thing that really made me sit up and take notice was the UKIA Trade Forum. That's the UK Industrial Adhesives Trade Forum, it's an annual industry event, usually held in Birmingham at the NEC. I went in 2023 and 2024, both times representing Granville. So at the 2023 event — this was October 2023, I think the 17th or 18th, I've got the date somewhere actually, I kept the programme — there was a drinks reception on the first evening and I ended up at a table with Rob Gallagher from Kerrfield and a bloke called Nish — I think his surname was Patel or Patil, something like that — from Oakhurst. Rob was their Head of Trade Sales and Nish was I think a senior account manager.

So we're having a few drinks and Rob starts talking about how tough the market is and how margins are getting squeezed and wouldn't it be nice if we could all stop cutting each other's throats on price. And I sort of laughed and said something like "well that would be nice wouldn't it" because I thought he was just having a moan, you know, the way people do at these things after a few beers. But then Nish said something like "well we don't have to, do we" and Rob said "exactly" and started talking about how there was no point in a race to the bottom when we're all facing the same cost pressures.

I want to be clear — at that point nobody said "let's fix prices" or anything like that. It was more of a general conversation. But it made me uncomfortable. I actually think Rob was a bit drunk to be honest, he'd had quite a lot of wine. I excused myself and went to talk to someone else, I think it was a supplier from Germany, I can't remember his name.

But then — and this is the important bit — about two weeks after the forum, so this would be early November 2023, Rob Gallagher added me to a WhatsApp group. The group was called "Adhesives Lads" which I thought was a bit naff to be honest. It was Rob, Nish, me, and I think one other person from Kerrfield called Marcus something. Marcus Webb maybe? I'm not 100% on the surname. I've got screenshots of some of the messages which I'll send you.

Now the WhatsApp group, most of it was just industry chat. People sharing articles about raw material prices, moaning about customers, that sort of thing. A lot of it was just banter honestly. Rob's quite a character, he's always sending memes and football stuff. He's a massive Liverpool fan if that matters, which it probably doesn't.

BUT. There were some messages that worried me. The one I specifically remember — and I've got a screenshot of this — is from January 2024. Rob posted a message saying something like "we're going up 5% on standard epoxies from March 1, heads up" and then a winking emoji. And then Nish replied "noted, think we'll be similar" and then I think Marcus said something too but I can't remember what. I didn't reply to that message. I just left it on read.

And then it happened again in around June or July 2024 — Nish posted something about Oakhurst's upcoming price revision and Rob replied with a thumbs up. I'd have to check my screenshots for the exact dates and wording, my memory isn't perfect on the details.

What I can tell you is that Granville's prices DID go up by around 5% on the standard epoxy range from March 2024. I saw it on the internal system. But I don't know if that was because of what Rob said in the WhatsApp or because Fiona's team had independently decided that. I genuinely don't know. I think it was probably a coincidence because Fiona was very data-driven and she had her own cost models, but I can't say for certain. That's probably something you should look into.

The thing is, I never told Mike or Fiona about the WhatsApp group. I know I should have done. I was worried about getting in trouble and I also thought maybe I was overthinking it and it was all just chat. My wife actually told me I should report it — she works in compliance for a bank so she knows about these things — but I just kept putting it off. I feel pretty bad about that now to be honest.

I also want to say that I think Granville's senior management — Mike Stanton, Fiona Ashworth, the CEO Graham Price — I honestly don't believe they knew anything about this. Graham is very hot on compliance, he made us all do competition law training every year, there was an online module we had to complete. I did mine every year. So it's not like we didn't know the rules. I knew what I was seeing in that WhatsApp group was potentially dodgy, that's why it made me uncomfortable. But I also want to stress that I never shared any of Granville's pricing information in that group. I never posted anything about our prices or our plans. I was basically a lurker. I probably should have left the group but I didn't and I accept that looks bad.

Oh and one other thing — at the 2024 Trade Forum, so this would have been October 2024, there was another conversation. This time it was just me and Rob, we bumped into each other at the coffee station on day two. He said something like "good that we're all on the same page on pricing, keeps things stable for everyone" and I said something noncommittal like "mmm" or "yeah I suppose" — I honestly can't remember my exact words but I definitely did NOT agree to anything or say anything about Granville's pricing plans. I think Rob was fishing for information and I didn't give him any. Actually I'm pretty sure I changed the subject to talk about the keynote speaker, who was some professor from Imperial who was incredibly boring, went on for about 45 minutes about polymer chemistry and half the room fell asleep.

Actually while I'm at it there's something else. My colleague Tom Brightman — he's still at Granville, he's a sales rep on my old team — Tom told me after I left that he'd heard from someone at Kerrfield, I think it was their receptionist or office manager or someone, that Rob Gallagher had been fired in about November 2025 for "gross misconduct" and that it was related to the CMA investigation. I don't know if that's true but if it is it's interesting isn't it. Tom's a reliable bloke, known him for years, he's not one for gossip. But obviously that's just what he told me, I don't know it firsthand.

I resigned from Granville in August 2025. It wasn't because of any of this — I got offered a better role at a company called Barrett Industrial, which is in a completely different sector, they do HVAC equipment. I handed in my notice on 1 August and my last day was 29 August. I didn't have any exit interview about the CMA stuff, it hadn't come up at that point I don't think. The CMA investigation was announced in September as far as I know.

One more thing — I made a note on my phone at the time of that January 2024 WhatsApp message from Rob about the 5% increase. I've got a photo of a handwritten note I made on a Post-it note because I was worried about it and I wanted to have a record in case it ever came up. The note says something like "Rob K'field — said 5% on epoxies from March. WA group. 15 Jan 2024." I kept the Post-it note in my desk drawer at home and I took a photo of it. I'll send you the photo. My wife saw me write it at the time so she can confirm I made it in January 2024 if needed.

Oh and I should mention — I briefly spoke to a journalist about this. Well, she contacted me actually. A woman from the Financial Times called Hannah something, she rang me about three weeks ago, said she was writing about the CMA investigation and had heard I used to work at Granville. I told her I couldn't comment and hung up. But I want you to know about that in case it comes up. I didn't tell her anything, honestly. My wife was there when I took the call, she'll confirm.

I think that's everything. Happy to answer any questions. And sorry this is all a bit rambling, I've been quite anxious about the whole thing to be honest. I just want to do the right thing.`

const WS_SUPPORTING_DOCS_TEXT = `Supporting Documents Bundle

Document Index

Doc Ref | Description | Date | Source
DK/1 | WhatsApp screenshots — "Adhesives Lads" group | Various (Nov 2023 – Jul 2024) | Daniel Kershaw personal phone
DK/2 | UKIA Trade Forum 2024 — Attendee list | October 2024 | Daniel Kershaw personal email
DK/3 | Email chain — Granville internal pricing discussion | February 2024 | Daniel Kershaw personal email (forwarded from work)
DK/4 | Photograph of handwritten note re: WhatsApp message | Photographed January 2024 | Daniel Kershaw

Document DK/1 — WhatsApp Screenshots

Screenshot 1 of 3: Group creation and early messages

Group: "Adhesives Lads"
Created by Rob Gallagher, 3 November 2023

Rob Gallagher (03/11/2023 14:22): Added you lot. Good to meet everyone at the forum last month. Figured it's useful to stay in touch given we're all in the same boat!

Nish Patil (03/11/2023 15:01): Good idea mate

Marcus Webb (03/11/2023 16:45): Cheers Rob. Any of you lot seeing the Henkel price increase hitting yet? Just had the letter through.

Rob Gallagher (03/11/2023 16:52): Yeah had ours last week. 6.5% on the base resins. Mental. Going to have to pass some of that on obviously.

Nish Patil (03/11/2023 17:10): Same here. Customers won't be happy but what can you do.

Rob Gallagher (04/11/2023 09:15): [Image — meme about supply chain problems]

Marcus Webb (04/11/2023 10:30): Ha! Too true mate

Screenshot 2 of 3: January 2024 pricing message

Group: "Adhesives Lads"

Rob Gallagher (15/01/2024 11:37): Right lads bit of a heads up, we're putting standard epoxies up 5% from 1 March. Cost base is just not sustainable at current levels. Thought you'd want to know (winking emoji)

Nish Patil (15/01/2024 12:04): Noted. Think we'll be looking at something similar tbh. Our cost review is end of this month.

Marcus Webb (15/01/2024 12:15): Makes sense. Think we're all in the same position aren't we.

Rob Gallagher (15/01/2024 12:20): Exactly. No point any of us trying to undercut when we're all getting squeezed from the same direction. Rising tide lifts all boats and all that

[Daniel Kershaw did not post any messages in this thread]

Screenshot 3 of 3: June 2024 pricing message

Group: "Adhesives Lads"

Nish Patil (24/06/2024 09:45): Quick one — we're doing our H2 price revision. Looking at 3-4% across the board on sealants from September. Epoxies staying flat for now.

Rob Gallagher (24/06/2024 10:02): Sensible. We're reviewing next month but expect similar direction of travel.

Rob Gallagher (24/06/2024 10:03): How's everyone's Q2 looking btw? We're about 3% up on last year.

Marcus Webb (24/06/2024 11:30): Similar for us. Sealants been strong.

[Daniel Kershaw did not respond to pricing messages in this exchange]

Rob Gallagher (24/06/2024 15:44): Anyone watching the Euros tonight?

Daniel Kershaw (24/06/2024 16:01): Yeah should be a good one! Come on England

Document DK/2 — UKIA Trade Forum 2024 Attendee List

UK Industrial Adhesives Trade Forum 2024
15–16 October 2024 | NEC, Birmingham

Registered Attendees (Extract — Distributor Representatives Only):

Name | Company | Role
Daniel Kershaw | Granville Building Supplies Ltd | Regional Sales Manager
Mike Stanton | Granville Building Supplies Ltd | National Sales Director
Rob Gallagher | Kerrfield Distribution Ltd | Head of Trade Sales
Marcus Webb | Kerrfield Distribution Ltd | Senior Account Manager
Nish Patil | Oakhurst Industrial Products plc | Senior Account Manager
Claire Donovan | Oakhurst Industrial Products plc | Commercial Analyst
Simon Greaves | Oakhurst Industrial Products plc | Regional Sales Director

[List continues with 47 further attendees from suppliers, manufacturers, and trade bodies]

Document DK/3 — Email Chain: Granville Internal Pricing Discussion

[Forwarded from Daniel Kershaw's Granville work email to his personal email on 28 February 2024]

From: Fiona Ashworth <f.ashworth@granville-bs.co.uk>
To: All Sales Managers Distribution List
CC: Mike Stanton <m.stanton@granville-bs.co.uk>
Date: 26 February 2024
Subject: Q2 Price Adjustment — Industrial Adhesives Range

All,

Please see below the confirmed price adjustments effective 1 March 2024. These have been approved by the Board following our Q1 cost review.

Standard Epoxy Range: +5.0%
Specialist Epoxy Range: +3.5%
Standard Sealants: +4.0%
Polyurethane Adhesives: No change

These adjustments reflect the cumulative impact of raw material cost increases from Henkel (notified November 2023 and January 2024) and increased logistics costs following the new distribution contract with DHL.

I attach the updated price list and a briefing note for customer-facing discussions. The key message is that these are cost-driven adjustments and we have absorbed as much as we can. Please do not speculate about competitor pricing with customers.

The updated price list will go live on the system on 1 March.

Any questions, come to me directly.

Fiona

From: Mike Stanton <m.stanton@granville-bs.co.uk>
To: All Sales Managers Distribution List
Date: 26 February 2024
Subject: RE: Q2 Price Adjustment — Industrial Adhesives Range

All — just to reinforce Fiona's point about competitor pricing. We do NOT discuss our pricing with competitors, full stop. If customers mention competitor prices to you, listen but do not comment. If competitors approach you to discuss pricing, disengage and report it to me or Fiona immediately. This is a compliance issue and I take it very seriously.

Mike

Document DK/4 — Photograph of Handwritten Note

[Description of photograph — the original would be an image file]

Photograph of a yellow Post-it note, slightly crumpled, with handwriting in blue biro. The handwriting reads:

"Rob K'field — WhatsApp — said they're going up 5% on std epoxies from March. Others agreed. 15 Jan 2024"

The Post-it note is photographed on what appears to be a wooden desk surface. A partial date stamp from the phone's camera metadata shows: "15/01/2024 18:47" — consistent with the photo being taken on the same date as the WhatsApp message.

[Note: The original photograph would need to be verified. The metadata should be checked and the witness should confirm the circumstances in which the note was made and photographed.]`

const WS_IDEAL_STATEMENT_TEXT = `IN THE MATTER OF AN INVESTIGATION BY THE COMPETITION AND MARKETS AUTHORITY

UNDER THE COMPETITION ACT 1998

Case Reference: CMA/ADH/2025/0342

CONCERNING: Suspected infringement of the Chapter I prohibition in the market for the distribution of industrial adhesives and sealants in the United Kingdom

WITNESS STATEMENT OF DANIEL KERSHAW

I, DANIEL KERSHAW, of [address known to Blackwell Harte LLP], former Regional Sales Manager at Granville Building Supplies Ltd, make this statement in connection with the Competition and Markets Authority's investigation into suspected price-fixing in the industrial adhesives market (Case Reference CMA/ADH/2025/0342).

1. Unless otherwise indicated, the facts stated in this witness statement are within my own knowledge and are true. Where I refer to matters of information or belief, I identify the source of that information or the basis for that belief.

My role at Granville Building Supplies Ltd

2. I was employed by Granville Building Supplies Ltd ("Granville") as a Regional Sales Manager from March 2019 to 29 August 2025, when I left voluntarily to take up a new role in a different sector. My region covered the North West of England and Yorkshire, which accounted for approximately 15% of Granville's UK sales. I managed a team of four sales representatives and reported to Mike Stanton, who was the National Sales Director.

3. My role involved managing relationships with Granville's key accounts in my region, principally construction firms and manufacturers who purchased industrial adhesives and sealants in bulk.

Pricing at Granville

4. Pricing at Granville was set centrally by the commercial team, which was led by Fiona Ashworth, the Commercial Director. As a Regional Sales Manager, I did not have authority to set or amend list prices. I had discretion to offer discounts to key accounts of up to 8%; any discount above that level required approval from Mike Stanton.

5. I was not involved in the process by which Fiona Ashworth and her team determined the list prices that appeared on Granville's price lists.

Observations about pricing in the market

6. From approximately mid-2022 onwards, I became aware that when Granville increased its prices, the other major distributors — Kerrfield Distribution Ltd ("Kerrfield") and Oakhurst Industrial Products plc ("Oakhurst") — appeared to implement similar increases within a short period.

7. I did not see Kerrfield's or Oakhurst's price lists directly. My awareness of their pricing came from information provided to me by customers. In particular, Dave Barton of Cresswell Construction and Jenny Okonkwo of Precision Manufacturing both mentioned to me on separate occasions that price increases from the three main distributors appeared to be closely aligned in timing and amount. I am informed by Dave Barton and believe that on at least one occasion he told me words to the effect of "your prices have gone up the same as everyone else's again." I am informed by Jenny Okonkwo and believe that she raised similar concerns with me, although I cannot recall the specific dates or precise words used.

8. At the time, I considered that the similarity in pricing could be explained by the fact that all three distributors were subject to the same cost pressures, in particular raw material price increases from Henkel AG, which was a major supplier to all three companies.

The UKIA Trade Forum — October 2023

9. I attended the UK Industrial Adhesives Trade Forum ("the Trade Forum") in October 2023 at the NEC, Birmingham, representing Granville. The Trade Forum is an annual industry event attended by distributors, suppliers, manufacturers, and trade bodies.

10. On the first evening of the 2023 Trade Forum, there was a drinks reception. During the reception, I was at a table with Rob Gallagher, who was Head of Trade Sales at Kerrfield, and an individual called Nish, whose surname I believe was Patil, who was a Senior Account Manager at Oakhurst.

11. During this conversation, Rob Gallagher made comments about the difficulty of the market conditions and the pressure on margins. He said words to the effect that it would be beneficial if the distributors could stop undercutting each other on price. Nish Patil responded with words to the effect of "well we don't have to, do we." Rob Gallagher agreed and spoke about there being no point in "a race to the bottom" when all three companies were facing the same cost pressures.

12. I wish to be clear that during this conversation, no one used the words "price-fixing" or expressly proposed a specific agreement on pricing. The conversation was general in nature. However, it caused me discomfort and I left the table shortly afterwards.

The WhatsApp group

13. Approximately two weeks after the 2023 Trade Forum, on or around 3 November 2023, Rob Gallagher created a WhatsApp group called "Adhesives Lads" and added me to it. The other members were Rob Gallagher (Kerrfield), Nish Patil (Oakhurst), and an individual I believe was called Marcus Webb from Kerrfield. I exhibit at DK/1 screenshots from this WhatsApp group.

14. The majority of the messages in the group were general industry discussion, including the sharing of articles about raw material costs and general market commentary. Some messages were social in nature and unrelated to business.

15. However, on 15 January 2024, Rob Gallagher posted a message in the group stating words to the effect that Kerrfield was increasing its prices on standard epoxies by 5% from 1 March, and adding a winking emoji. Nish Patil replied stating that Oakhurst would be "looking at something similar." Marcus Webb posted a message indicating agreement. I did not respond to these messages.

16. On 24 June 2024, Nish Patil posted a message in the group stating that Oakhurst was implementing a price revision of 3-4% across its sealants range from September, with epoxies remaining unchanged. Rob Gallagher responded with a thumbs-up emoji and indicated that Kerrfield expected to move in a "similar direction." I did not respond to the pricing messages in this exchange.

17. I did not at any time post any messages in the WhatsApp group disclosing Granville's pricing information, pricing plans, or any other competitively sensitive information. The screenshots exhibited at DK/1 confirm that my only contribution to the group was a social message about a football match on 24 June 2024.

The contemporaneous note

18. On 15 January 2024, the same day as the WhatsApp message described in paragraph 15 above, I made a handwritten note on a Post-it note recording what Rob Gallagher had said. The note reads: "Rob K'field — WhatsApp — said they're going up 5% on std epoxies from March. Others agreed. 15 Jan 2024." I photographed this note on my phone on the same day. I exhibit at DK/4 a copy of this photograph. The photograph metadata records the date as 15 January 2024.

19. I made this note because I was concerned about what I had seen in the WhatsApp group and wished to keep a contemporaneous record.

Granville's pricing in March 2024

20. I am aware that Granville implemented a price increase of 5% on its standard epoxy range effective 1 March 2024. I was notified of this by an email from Fiona Ashworth to all sales managers dated 26 February 2024, which I exhibit at DK/3. The email states that the price adjustments reflected raw material cost increases from Henkel and increased logistics costs.

21. On the same date, Mike Stanton sent a follow-up email to all sales managers (also exhibited at DK/3) reminding the team not to discuss Granville's pricing with competitors and to report any approach from a competitor to discuss pricing.

22. I do not know whether there was any connection between the information shared in the WhatsApp group and Granville's pricing decision. I was not involved in setting list prices. I note that the email from Fiona Ashworth identifies specific cost justifications for the increase, and that Granville's annual competition law compliance training emphasised the requirement for independent pricing decisions.

Failure to report

23. I did not report the WhatsApp group or its contents to Mike Stanton, Fiona Ashworth, or any other member of Granville's senior management at any time during my employment. I accept that I should have done so. I was concerned about the potential consequences for myself, and I also considered that I might be overinterpreting what were relatively brief and informal messages.

The UKIA Trade Forum — October 2024

24. I attended the Trade Forum again in October 2024. I exhibit at DK/2 an extract from the attendee list, which records my attendance and that of Rob Gallagher and Nish Patil among others.

25. During the second day of the event, I had a brief conversation with Rob Gallagher near the coffee station. He said words to the effect of "good that we're all on the same page on pricing, keeps things stable for everyone." I responded noncommittally. I did not agree with his statement, share any information about Granville's pricing, or make any commitment of any kind. I changed the subject shortly afterwards.

Senior management knowledge

26. Based on my experience at Granville over approximately six and a half years, it is my belief that Granville's senior management — specifically Mike Stanton (National Sales Director), Fiona Ashworth (Commercial Director), and Graham Price (Chief Executive Officer) — were not aware of the WhatsApp group or the conversations I have described at the Trade Forum. I say this because:

    (a) Graham Price placed considerable emphasis on competition law compliance, including mandatory annual training for all staff, which I completed each year;
    (b) Mike Stanton's email of 26 February 2024, exhibited at DK/3, explicitly instructed sales managers not to discuss pricing with competitors and to report any such approach; and
    (c) I never witnessed any communication between Granville's senior management and representatives of Kerrfield or Oakhurst concerning pricing.

27. However, I accept that I do not have direct knowledge of all communications between Granville's senior management and the other distributors, and I cannot state with certainty what they did or did not know.

My departure from Granville

28. I resigned from Granville on 1 August 2025 and my last day of employment was 29 August 2025. My resignation was for personal career reasons — I accepted a role at Barrett Industrial Ltd, a company in the HVAC sector. My departure was not connected to the matters described in this statement. The CMA's investigation was announced publicly in September 2025, after I had left Granville.

Contact from a journalist

29. Approximately three weeks before the date of this statement, I received an unsolicited telephone call from a person who identified herself as a journalist from the Financial Times and stated that she was writing about the CMA investigation. I told her that I could not comment and ended the call. I did not provide her with any information.

Statement of Truth

I believe that the facts stated in this witness statement are true. I understand that proceedings may be brought against me if it is found that I have made, or caused to be made, a statement in a document used in connection with proceedings which I knew to be false or did not believe to be true.

Signed: .......................................

DANIEL KERSHAW

Dated: .......................................

Exhibit List

Exhibit Ref | Description
DK/1 | Screenshots from "Adhesives Lads" WhatsApp group (3 pages)
DK/2 | UKIA Trade Forum 2024 — Attendee list (extract)
DK/3 | Email chain: Fiona Ashworth and Mike Stanton to all sales managers, dated 26 February 2024, re Q2 Price Adjustment
DK/4 | Photograph of handwritten contemporaneous note dated 15 January 2024`

const WS_IDEAL_MEMO_TEXT = `MEMORANDUM

To: Sarah Thornton (Partner)
From: [Trainee]
Date: 10 February 2026
Re: Granville — Draft Witness Statement of Daniel Kershaw
Ref: CMA/ADH/2025/0342

PRIVILEGED AND CONFIDENTIAL

1. Summary

Please find attached my first draft of Mr Kershaw's witness statement. I have structured it chronologically and attempted to include only relevant and admissible evidence. I set out below the key issues I have identified and my suggested next steps.

2. Approach Taken

I have reviewed the attendance note of the call with Mr Kershaw, the four supporting documents he provided, and the case summary. I have drafted the statement in the first person in Mr Kershaw's own words, reorganised the narrative chronologically, and stripped out irrelevant personal material (his relocation, family details, and various tangential anecdotes).

The statement focuses on the matters he can give direct evidence about: his role at Granville, the pricing structure, the Trade Forum conversations, the WhatsApp group, and his knowledge of senior management's involvement.

3. Key Issues Identified

3.1 Hearsay

The following material in Mr Kershaw's account is hearsay and I have handled it as follows:

(a) Customer reports about competitor pricing (Dave Barton & Jenny Okonkwo): Mr Kershaw did not see Kerrfield's or Oakhurst's price lists. His knowledge of their pricing comes from what customers told him. I have included this in the statement because it explains why he became aware of the apparent alignment, but I have clearly marked it as information received from others and identified the sources. If this statement is used at trial, a hearsay notice under CPR Part 33 would be required for this material. I would suggest we consider whether we actually need this evidence — the WhatsApp messages are direct evidence of information exchange, so the customer hearsay may be unnecessary and potentially opens up lines of cross-examination we do not want.

(b) Tom Brightman's account of Rob Gallagher's dismissal: This is double hearsay — Mr Kershaw was told by Tom Brightman, who was told by someone at Kerrfield, that Rob Gallagher was dismissed for gross misconduct. I have excluded this entirely from the statement. It is unreliable, its probative value is limited, and including it could be seen as speculative. If we want to establish that Mr Gallagher was dismissed, we should seek this information through formal channels.

(c) Jenny Okonkwo's complaint: Mr Kershaw mentions that Jenny Okonkwo "made a complaint to someone" but does not know to whom or in what terms. I have not included this as it is vague and unverifiable. We may wish to investigate separately whether the CMBA complaint originated from or was informed by Ms Okonkwo.

3.2 Opinion Evidence

I have removed the following opinion evidence from Mr Kershaw's account:

- His view that Rob Gallagher was "a bit drunk" at the 2023 Trade Forum — this is opinion about another person's level of intoxication and is not necessary to the factual account.
- His assessment that Fiona Ashworth was "very data-driven" — this is character evidence / opinion that is not for him to give. The statement instead refers objectively to the email evidence showing Fiona's independent cost justification.
- His belief that the March 2024 price increase was "probably a coincidence" — this is speculation. I have instead stated neutrally that he does not know whether there was a connection, and referred to the objective evidence.

I have retained his evidence about what he believes Granville's senior management knew (paragraph 26 of the draft), as this is opinion based on his direct experience working at the company for six and a half years. I have supported it with specific factual bases (the compliance training, Mike Stanton's email). However, I have added paragraph 27 as an appropriate caveat acknowledging the limits of his knowledge. Please confirm you are happy with this approach.

3.3 The "Lurker" Issue

Mr Kershaw's position that he was a passive member of the WhatsApp group is supported by the screenshots, which show he did not post any pricing information. However, his continued membership of the group after seeing the January 2024 pricing message is potentially problematic for Granville. I have included his candid admission that he failed to report the group (paragraph 23). If we are pursuing a leniency application, this candour is likely beneficial, but I would welcome your view on how much emphasis to place on this.

3.4 The Forwarded Email (DK/3)

Mr Kershaw forwarded Fiona Ashworth's internal pricing email from his work email to his personal email on 28 February 2024. The reason for this is not explained in the attendance note and I have not addressed it in the statement. This could be innocent (he wanted a personal record given his concerns) or it could raise questions. I recommend we ask him about this at the next meeting.

3.5 Contact from the Financial Times

I have included this briefly (paragraph 29) as it is relevant to disclosure and transparency. Mr Kershaw says he provided no information. We should advise him not to engage with any further press enquiries and to refer any contact to us.

4. Questions to Go Back to Mr Kershaw

I recommend the following follow-up questions:

1. Exact dates of the 2023 Trade Forum — He says he has the programme. Can we obtain a copy?
2. Nish Patil's surname — He is uncertain. The attendee list (DK/2) confirms "Nish Patil" — I have used this in the statement but we should confirm with Mr Kershaw.
3. Marcus Webb — Mr Kershaw is unsure of the surname. We should confirm and establish Marcus Webb's role at Kerrfield.
4. Jenny Okonkwo's complaint — Who did she complain to? Could she be a witness?
5. Why he forwarded the pricing email to his personal email — We need an explanation for this.
6. Is the WhatsApp group still active? Has he left it? Are there further messages beyond June 2024?
7. Does he have the original Post-it note? Or only the photograph? We should inspect the original if available.
8. Completeness of screenshots — Do the screenshots he has provided capture all the pricing-related messages, or were there others?
9. Any other conversations at the Trade Forum — Beyond those described, did he observe Rob Gallagher or Nish Patil speaking with anyone from Granville's senior management?

5. Hearsay Notice

If this statement is used in proceedings, the hearsay evidence in paragraph 7 (customer reports of aligned pricing) would require a hearsay notice under CPR Part 33. I have not drafted one at this stage as we are not yet in proceedings, but I can prepare one if needed. As noted above, I query whether we need to rely on this hearsay at all given the direct evidence from the WhatsApp messages.

6. Next Steps

- Your review and comments on the draft statement
- Follow-up call or meeting with Mr Kershaw to address the questions above
- Verify the photograph metadata (DK/4) — can we have our e-disclosure team examine the original image file?
- Consider whether we should take a short statement from Mr Kershaw's wife, who may be able to corroborate the timing of the handwritten note and the journalist call
- Advise Mr Kershaw in writing not to engage with any further press enquiries
- Consider whether the WhatsApp screenshots should be forensically preserved (extraction from the original device)

I am available to discuss this afternoon if helpful.`

const WS_FEEDBACK_TEMPLATE_TEXT = `Supervisor Feedback Memo — Typical Trainee Errors

This document is used by the AI to generate realistic feedback on the trainee's first draft.

From: Sarah Thornton
Tone: Direct, constructive, slightly impatient but fair.

Common feedback points:

1. If double hearsay (Tom Brightman / Gallagher dismissal) is included: "Take it out. This is double hearsay and makes us look sloppy."

2. If opinion about Rob being drunk is included: "Remove it. It's opinion and looks like we're trying to discredit a witness at the statement stage."

3. If irrelevant personal detail is included: "None of this is relevant. Every paragraph should advance the factual narrative."

4. If "probably a coincidence" speculation is included: "Delete it. Dan doesn't know and it's not for him to speculate."

5. If hearsay in customer reports is not identified: "This is hearsay. It needs to be flagged as information and belief with sources identified."

6. If statement of truth is wrong: "Check the prescribed form. This matters."

7. If exhibits are not properly referenced: "Each exhibit needs a proper marker and an explanation of what it shows."

8. If legal conclusions are included: "That's a legal conclusion, not a factual statement. Rewrite as a description of what happened."

9. If tone is argumentative: "This reads like a skeleton argument, not a witness statement. Let the facts speak."

10. If senior management knowledge is mishandled: "Set out the factual basis for the belief and add a caveat."

11. If forwarded email is not flagged: "Why did Dan forward Fiona's email to his personal address? Flag this in your memo."

12. If memo is too brief: "Tell me what's problematic, what you've left out and why, and what questions we need to go back to Dan with."`

const WS_EXERCISE_MARKDOWN = `# Witness Statement Drafting — Training Exercise

## Background

You are a trainee solicitor in the Competition & Regulatory department at **Blackwell Harte LLP**. Your supervising partner, **Sarah Thornton**, has emailed you an urgent task.

The firm acts for **Granville Building Supplies Ltd**, which is the subject of a **Competition and Markets Authority (CMA) investigation** into suspected price-fixing in the industrial adhesives market. Three major distributors are under investigation for alleged coordination of pricing.

During the firm's internal investigation, a former employee — **Daniel Kershaw** — has come forward with information. He was a Regional Sales Manager at Granville and has knowledge of conversations and a WhatsApp group involving competitors.

## Your Role

You have been asked to:

1. **Review** the case background and Sarah's instructions
2. **Analyse** the raw witness material — a rough attendance note from a call with Daniel Kershaw, plus supporting documents
3. **Produce a planning note** identifying key facts, hearsay, opinion, exhibits, and follow-up questions
4. **Draft a witness statement** compliant with CPR Part 32 and Practice Direction 32A
5. **Draft a covering memo** to Sarah flagging issues, concerns, and next steps

## Documents Provided

- **Case Summary** — Background note on the CMA investigation
- **Instruction Email** — Sarah Thornton's email setting out the task and specific instructions
- **Witness Transcript** — Rough attendance note from the call with Daniel Kershaw (deliberately rambling)
- **Supporting Documents** — WhatsApp screenshots, Trade Forum attendee list, internal pricing emails, contemporaneous note

## Key Skills Tested

- **Hearsay identification** — distinguishing direct evidence from information and belief (CPR Part 33)
- **Opinion evidence** — identifying and excluding inadmissible opinion
- **CPR compliance** — correct format under Part 32 and Practice Direction 32A
- **Exhibit handling** — selecting relevant documents and correct exhibit markers
- **Analytical drafting** — structuring a coherent narrative from chaotic source material
- **Professional judgment** — identifying non-obvious issues (forwarded email, screenshot completeness)
- **Communication** — producing a thoughtful internal memo

## How This Exercise Works

1. **Step 1 — Receive Instruction:** Read the case summary and instruction email
2. **Step 2 — Review & Plan:** Analyse the witness transcript and documents; produce a planning note
3. **Step 3 — Draft Statement:** Produce a CPR-compliant witness statement
4. **Step 4 — Draft Memo:** Produce a covering memo flagging issues and next steps
5. **Step 5 — Review Feedback:** Receive supervisor feedback and produce a revised draft

You may ask questions at any time using the chat panel — this simulates asking Sarah Thornton for guidance.

## Key Rules

- **Hearsay must be flagged** — identify the source and flag hearsay notice requirements
- **No opinion evidence** — unless within a permitted exception
- **No legal conclusions** — the witness describes facts, not whether something constitutes an infringement
- **No argumentative language** — "it is clear that" is a submission, not evidence
- **Strip irrelevant material** — personal tangents have no place in a witness statement
- **Exhibit properly** — explain what each document is and why it matters

**Take your time.** This exercise is designed to take 6–8 hours. Accuracy and judgment matter more than speed.

---

*Good luck!*`

// ============================================================
// Letter Before Action Exercise
// ============================================================

function buildLbaExercise(): Exercise {
  const now = new Date().toISOString()

  const exercise: Exercise = {
    id: LBA_ID,
    title: 'Letter Before Action — Breach of Contract Counterclaim',
    description: 'Respond to a Letter Before Action claiming an unpaid invoice by drafting a defence and counterclaim LBA on behalf of the innocent party. Analyse the contract, identify breaches and heads of loss, comply with the pre-action protocol, and prepare a client advice note assessing strengths and weaknesses.',
    matterType: 'Civil Litigation — Breach of Contract (B2B)',
    difficulty: 'junior',
    estimatedDurationMinutes: 420,
    documents: [
      {
        id: LBA_DOC_IDS.clientInstruction,
        exerciseId: LBA_ID,
        filename: 'client_instruction_email.md',
        mimeType: 'text/markdown',
        role: 'instruction',
        label: 'Client Instruction Email — Rebecca Haines (Fairway Events)',
        extractedText: LBA_CLIENT_INSTRUCTION_TEXT,
        uploadedAt: now,
      },
      {
        id: LBA_DOC_IDS.otherSideLba,
        exerciseId: LBA_ID,
        filename: 'other_side_lba.md',
        mimeType: 'text/markdown',
        role: 'source-material',
        label: 'Letter Before Action from Barker & Co (Luxe Marquees)',
        extractedText: LBA_OTHER_SIDE_TEXT,
        uploadedAt: now,
      },
      {
        id: LBA_DOC_IDS.contract,
        exerciseId: LBA_ID,
        filename: 'contract.md',
        mimeType: 'text/markdown',
        role: 'source-material',
        label: 'Contract — Fairway Events Ltd / Luxe Marquees Ltd',
        extractedText: LBA_CONTRACT_TEXT,
        uploadedAt: now,
      },
      {
        id: LBA_DOC_IDS.idealLba,
        exerciseId: LBA_ID,
        filename: 'ideal_lba.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Letter Before Action',
        extractedText: LBA_IDEAL_LBA_TEXT,
        uploadedAt: now,
      },
      {
        id: LBA_DOC_IDS.idealAdvice,
        exerciseId: LBA_ID,
        filename: 'ideal_advice_note.md',
        mimeType: 'text/markdown',
        role: 'ideal-output',
        label: 'Ideal Client Advice Note',
        extractedText: LBA_IDEAL_ADVICE_TEXT,
        uploadedAt: now,
      },
    ],
    steps: [
      {
        id: 'step-1',
        order: 1,
        title: 'Review Instructions and Documents',
        instruction: `You are a trainee solicitor in the litigation department. Your supervising partner, Catherine Osei, has asked you to handle this matter.

**Your task:** Read all three documents carefully:
1. The client instruction email from Rebecca Haines (Fairway Events)
2. The Letter Before Action from Barker & Co (on behalf of Luxe Marquees)
3. The underlying contract between Fairway Events and Luxe Marquees

As you read, consider:
- What breaches of contract has Luxe committed?
- What heads of loss can Fairway claim?
- What are the strengths and weaknesses of each head?
- What does the pre-action protocol require?

When you are ready, mark this step as complete. You may ask questions using the chat — treat it as Catherine Osei.`,
        type: 'read',
        visibleDocuments: [LBA_DOC_IDS.clientInstruction, LBA_DOC_IDS.otherSideLba, LBA_DOC_IDS.contract],
        idealOutput: null,
        gradingCriteria: [],
        maxScore: 0,
      },
      {
        id: 'step-2',
        order: 2,
        title: 'Draft Letter Before Action',
        instruction: `Now draft a Letter Before Action on behalf of Fairway Events Ltd.

**Your task:** Produce a formal LBA that:

1. **Responds to Barker & Co's claim** — dispute the outstanding balance and state the basis for the defence
2. **Sets out the breaches** — late installation (Clause 2.2), non-conforming equipment (Clauses 3.1/3.2), defective installation
3. **Sets out the counterclaim** with each head of loss:
   - Liquidated damages for late installation (Clause 5.1)
   - Cost of replacement furniture
   - Cost of replacement lighting
   - Staff overtime costs
   - Recovery of deposit (repudiatory breach / total failure of consideration argument)
   - Loss of Harringtons contract (consequential loss — to be quantified)
4. **Includes a summary table** of the counterclaim
5. **Asserts set-off** — the counterclaim exceeds Luxe's claim
6. **Lists documents relied upon**
7. **Proposes ADR** (mediation) with reference to costs consequences
8. **Sets a deadline** for response (14 days)
9. **Addresses the delay** in responding to Barker & Co's October letter
10. **Complies with the Practice Direction — Pre-Action Conduct and Protocols**

**Important:** The LBA goes to the other side. Do NOT include privileged advice, strategy, or your assessment of weaknesses. Keep the tone firm, factual and professional.`,
        type: 'draft',
        visibleDocuments: [LBA_DOC_IDS.clientInstruction, LBA_DOC_IDS.otherSideLba, LBA_DOC_IDS.contract],
        idealOutput: LBA_IDEAL_LBA_TEXT,
        gradingCriteria: [
          'Protocol: Identified as a Letter Before Action with clear heading (1pt)',
          'Protocol: References Practice Direction — Pre-Action Conduct and Protocols (2pts)',
          'Protocol: Addresses delay in responding to Barker & Co October 2025 LBA (1pt)',
          'Protocol: Properly addressed to Barker & Co and/or Luxe directly (1pt)',
          'Protocol: Lists documents relied upon (2pts)',
          'Protocol: Proposes ADR / mediation with reference to costs consequences (2pts)',
          'Protocol: Sets deadline for response — 14 days or similar (1pt)',
          'Defence: Disputes the claim clearly and unambiguously (2pts)',
          'Defence: Identifies right of set-off — counterclaim exceeds balance due (3pts)',
          'Defence: Addresses contractual interest claim (1pt)',
          'Defence: Links defence to specific contractual breaches (2pts)',
          'Counterclaim: Liquidated damages — identifies Clause 5.1, calculates correctly at £2,000 for one day, references time of the essence (3pts)',
          'Counterclaim: Replacement furniture — identifies breach of Clauses 3.1/3.2, states cost £12,500 + VAT, references Clause 3.3 right to replacement (3pts)',
          'Counterclaim: Replacement lighting — same analysis, states cost £3,800 + VAT (3pts)',
          'Counterclaim: Staff overtime — states cost £2,400, explains necessity (2pts)',
          'Counterclaim: Deposit recovery — identifies repudiatory breach / total failure of consideration argument, states amount £14,400 + VAT, claims alternatively as set-off (3pts)',
          'Counterclaim: Loss of Harringtons contract — identifies as consequential loss, states approximate value, notes to be quantified, provides factual basis (4pts)',
          'Counterclaim: Summary table of all heads of loss with totals (2pts)',
          'Counterclaim: Breaches clearly identified — late installation (Clause 2.2), non-conforming equipment (Clauses 3.1/3.2), defective installation (2pts)',
          'Quality: Professional tone — firm but measured, not aggressive or emotional (2pts)',
          'Quality: Correct party names and references throughout (1pt)',
          'Quality: Logical structure — defence, then breaches, then counterclaim, then procedure (1pt)',
          'Quality: Sent on partner authority — appropriate for trainee-drafted letter (1pt)',
          'DEDUCTION: Includes privileged advice or strategy in the LBA (-5pts)',
          'DEDUCTION: Aggressive, threatening or unprofessional tone (-3pts)',
          'DEDUCTION: Claims full £65,000 revenue as lost profit without noting it needs quantification (-2pts)',
        ],
        maxScore: 45,
      },
      {
        id: 'step-3',
        order: 3,
        title: 'Draft Client Advice Note',
        instruction: `Now prepare a client advice note for Rebecca Haines.

**Your task:** Produce an advice note covering:

1. **Assessment of each head of claim** — strengths, weaknesses, and realistic prospects:
   - Defence to Luxe's claim (set-off)
   - Liquidated damages (penalty argument?)
   - Replacement furniture and lighting (mitigation)
   - Staff overtime (reasonableness)
   - Deposit recovery (total failure of consideration vs affirmation — the weakest head)
   - Harringtons loss (remoteness under *Hadley v Baxendale*, revenue vs profit, mitigation, causation)
   - Guest who tripped (third-party liability, indemnity clause, contribution claim)

2. **Procedural advice:**
   - Limitation
   - Court and track allocation (fast track vs multi-track depending on whether Harringtons loss is included)
   - Pre-action protocol compliance and the delay in responding
   - ADR recommendation
   - Costs

3. **Overall assessment:**
   - Best-case, realistic and worst-case scenarios
   - Settlement recommendation with a range
   - Practical next steps (profit margin data, comparative quote, guest contact status, mitigation evidence)

**Important:** This is privileged advice. Be candid and balanced — identify weaknesses honestly. The client wants a realistic assessment, not cheerleading.`,
        type: 'advise',
        visibleDocuments: [LBA_DOC_IDS.clientInstruction, LBA_DOC_IDS.otherSideLba, LBA_DOC_IDS.contract],
        idealOutput: LBA_IDEAL_ADVICE_TEXT,
        gradingCriteria: [
          'Defence to Luxe claim: Explains set-off, assesses as strong (3pts)',
          'Liquidated damages: Assesses as very strong, addresses potential penalty argument under Makdessi (2pts)',
          'Replacement furniture: Assesses as strong, addresses mitigation argument (3pts)',
          'Replacement lighting: Same analysis (2pts)',
          'Staff overtime: Assesses reasonableness, notes potential scrutiny of hours (2pts)',
          'Deposit recovery: Identifies as weakest head, analyses total failure of consideration vs repudiatory breach, acknowledges affirmation risk, gives realistic prospect assessment (4pts)',
          'Harringtons loss: Identifies remoteness issue and cites Hadley v Baxendale (5pts) — CRITICAL',
          'Harringtons loss: Distinguishes revenue from profit (must deduct costs of performing) — CRITICAL',
          'Harringtons loss: Addresses mitigation and causation',
          'Harringtons loss: Gives realistic prospect assessment with estimated recovery range',
          'Guest who tripped: Identifies third-party liability risk, references indemnity clause (Clause 6.1), references contribution claim under Civil Liability (Contribution) Act 1978, recommends insurer notification (3pts)',
          'Procedural: Limitation — confirms well within 6 years (1pt)',
          'Procedural: Court and track allocation — identifies likely track, notes multi-track implications if Harringtons included (2pts)',
          'Procedural: Pre-action protocol — addresses delay risk, reassures client (2pts)',
          'Procedural: ADR recommendation — recommends mediation, explains benefits, references costs consequences (2pts)',
          'Procedural: Costs — explains standard basis recovery and shortfall (1pt)',
          'Quality: Balanced and realistic — does not overstate prospects, identifies risks honestly (3pts)',
          'Quality: Gives best-case, realistic and worst-case scenarios with settlement range (2pts)',
          'Quality: Practical next steps — asks for profit margin data, comparative quote, guest contact, mitigation evidence (2pts)',
          'Quality: Appropriate caveats — notes privilege, notes advice may change (1pt)',
          'DEDUCTION: Overly optimistic — tells client everything will succeed (-5pts)',
          'DEDUCTION: No remoteness analysis for Harringtons loss (-4pts)',
          'DEDUCTION: Fails to distinguish revenue from profit on Harringtons claim (-3pts)',
        ],
        maxScore: 40,
      },
    ],
    rubric: {
      exerciseId: LBA_ID,
      overallApproach: 'The trainee should analyse the factual scenario methodically, starting with the contract to identify specific breaches, then matching each breach to a head of loss with a specific contractual or common law basis. The LBA should be comprehensive, protocol-compliant, and professional in tone — it is a document the other side will see. The advice note should be candid and balanced — it is privileged and the client has specifically asked for a realistic assessment. The key distinction the trainee must make is between what goes in the LBA (firm assertion of position) and what goes in the advice note (honest assessment of strengths AND weaknesses). The exercise tests the trainee\'s ability to handle a realistic B2B litigation matter from initial instructions through to pre-action correspondence.',
      keyIssues: [
        'Late installation — time was of the essence (Clause 2.2), clear breach',
        'Non-conforming equipment — wrong furniture and lighting, breach of Clauses 3.1/3.2 and Schedule 1',
        'Defective installation — torn linings, sagging roof, uneven flooring',
        'Liquidated damages — Clause 5.1, £2,000 per day, genuine pre-estimate vs penalty (Makdessi)',
        'Replacement costs — direct loss, reasonable mitigation, Clause 3.3 right to replacement',
        'Remoteness — Harringtons loss is consequential, Hadley v Baxendale two-limb test',
        'Revenue vs profit — lost business damages calculated on lost profit basis, not revenue',
        'Mitigation — client must take reasonable steps, replacement of furniture/lighting was reasonable',
        'Deposit recovery — repudiatory breach arguable but risky, event went ahead (affirmation)',
        'Total failure of consideration — difficult given partial performance',
        'Guest who tripped — potential OLA / negligence claim, contractual indemnity Clause 6.1, contribution under CLCA 1978',
        'Pre-action protocol compliance — delay in responding to October 2025 LBA',
        'ADR — must propose mediation, Halsey v Milton Keynes costs consequences',
        'Track allocation — claim value determines track, Harringtons loss pushes towards multi-track',
        'Privilege — LBA must not contain strategy or weakness assessment',
      ],
      criticalErrors: [
        'Including privileged advice or strategy in the LBA (e.g. assessing weaknesses of own position)',
        'Failing to identify the Harringtons loss as a consequential/remoteness issue',
        'Claiming full £65,000 revenue as damages without addressing profit vs revenue distinction',
        'Overstating the deposit recovery claim without acknowledging the affirmation risk',
        'Missing the ADR proposal entirely — protocol non-compliance',
        'Failing to reference the contract clauses — drafting without reference to the actual agreement',
        'Aggressive or unprofessional tone in the LBA',
        'Failing to address the delay in responding to Barker & Co\'s October letter',
        'Advice note is one-sided — only strengths, no weaknesses',
        'Treating the LBA and advice note identically — no understanding of privilege distinction',
      ],
      qualityMarkers: [
        'LBA is comprehensive, protocol-compliant and professionally drafted',
        'Each head of loss is tied to a specific contractual clause or legal principle',
        'Summary table in the LBA clearly sets out the counterclaim',
        'Set-off argument clearly stated — counterclaim exceeds Luxe\'s claim',
        'ADR proposal with reference to costs consequences (Halsey)',
        'Advice note distinguishes between strong and weak heads of claim',
        'Deposit recovery honestly assessed as the weakest argument',
        'Harringtons loss analysed with reference to remoteness (Hadley v Baxendale)',
        'Revenue vs profit distinction made for Harringtons claim',
        'Best-case, realistic and worst-case scenarios provided',
        'Settlement range recommended with commercial reasoning',
        'Guest who tripped identified with indemnity and contribution analysis',
        'Practical next steps requested from client',
      ],
      questionRelevanceGuidance: `Excellent questions (+3 points) show strong litigation instincts: "Should we consider whether the delay in responding to Barker & Co's LBA could have costs implications?" / "Do we have evidence of the profit margin on the Harringtons contract, or just the revenue figure?" / "Has the guest who tripped been in contact since the event? Should we be notifying our client's public liability insurer?"

Good questions (+2 points) are relevant to the claim or procedure: "Should we send the LBA to Barker & Co, to Luxe directly, or both?" / "Is there a specific pre-action protocol for this type of claim?" / "Should we include the Harringtons loss in the LBA or hold it back for now?"

Adequate questions (+1 point) are reasonable but obvious: "What format should the LBA take?" / "Should I address the contractual interest claim?"

Neutral questions (0 points): "How formal should the tone be?"

Poor questions (-1 point) ask about information already in the documents: "What is a Letter Before Action?" / "Is this a criminal case?"

Very poor questions (-2 points) fundamentally misunderstand the exercise: "What does the client want?" (clearly set out in the instructions)

Responses:
- Pre-action protocol: "Good question. Look at both the Practice Direction — Pre-Action Conduct and Protocols and the Pre-Action Protocol for Debt Claims. Since Luxe's claim is a debt claim, their letter should comply with the debt protocol. Our response and counterclaim should comply with the general Practice Direction."
- LBA addressee: "Send it to Barker & Co (as Luxe's solicitors on record) and copy it to Luxe directly. Standard practice."
- Delay in responding: "Yes, flag it and apologise briefly. The client didn't have legal representation. It's unlikely to be fatal but could be raised on costs."
- Harringtons loss — include or hold back: "Include it in the LBA but note that it is to be quantified. We want to put Luxe on notice of the full extent of the claim. But in the advice note, be honest about the risks of recovering it."
- Guest who tripped: "Good spot. We don't know if they've been in contact. Flag it in the advice note and recommend the client checks. Also consider whether the indemnity clause covers this."
- Profit margin on Harringtons: "We don't have the figures yet. Claim on the basis of revenue in the LBA but note in the advice that we'll need the actual profit margin to quantify the loss properly."
- Contractual interest: "Address it. Luxe has claimed contractual interest at 4% above base rate. Check the contract — if the clause exists, they're entitled to it in principle, but it should be set off against the counterclaim."`,
    },
    generatedMarkdown: LBA_EXERCISE_MARKDOWN,
    status: 'ready',
    createdAt: now,
    updatedAt: now,
  }

  return exercise
}

// --- LBA Exercise: Embedded Document Texts ---

const LBA_CLIENT_INSTRUCTION_TEXT = `Client Instruction Email

From: Rebecca Haines, Operations Director — Fairway Events Ltd
To: [Trainee Solicitor]
CC: Catherine Osei, Partner — [Your Firm]
Date: 5 February 2026
Subject: Unpaid invoices and breach of contract — Luxe Marquees Ltd

Dear [Trainee],

Catherine said you would be helping with this. I am absolutely at the end of my tether and need this sorted out as soon as possible. Apologies in advance for the long email — I want to make sure you have everything.

Background

Fairway Events Ltd is an events management company. We organise corporate events, weddings, festivals and private functions across the Midlands and South West. I am the Operations Director and sole shareholder. The company was incorporated in 2018 and we have grown quickly — turnover last year was about £1.8 million.

In March 2025, we entered into a contract with Luxe Marquees Ltd for the supply of marquee structures, flooring, lighting and furnishing for a major outdoor corporate event we were organising for one of our biggest clients, Harringtons plc (a regional property developer). The event was their annual summer gala, held on 19 July 2025 at Langley Park Estate near Warwick.

The Contract

The contract with Luxe Marquees was signed on 14 March 2025. I have attached a copy. The key terms were:

- Luxe would supply and erect a premium marquee structure (capacity 500 guests), with wooden flooring, LED festoon lighting, silk linings, and furniture (tables and chairs for 500).
- Installation was to be completed no later than 5:00 PM on 17 July 2025 (two full days before the event on 19 July).
- The total contract price was £48,000 plus VAT.
- Payment terms: 30% deposit on signing (£14,400 + VAT — paid on 18 March 2025), 70% balance (£33,600 + VAT) due within 14 days of the event.
- The contract contained a clause stating that "time is of the essence" in respect of the installation date.
- There was a liquidated damages clause providing for a deduction of £2,000 per day for each day of delay beyond the installation deadline, capped at £10,000.
- There was also a clause stating that the marquee and equipment must be "of satisfactory quality, fit for purpose and free from material defects."
- The contract was governed by the laws of England and Wales.
- There was no force majeure clause and no limitation of liability clause in the contract.

What Happened

Everything started going wrong about two weeks before the event:

3 July 2025: I emailed Luxe to confirm the installation schedule. Their project manager, Tom Bradley, replied saying they were "on track" and would arrive on site on 16 July for a two-day installation.

16 July 2025: The Luxe team arrived at Langley Park at about 10:00 AM. Only four workers turned up — Tom had previously told me they would send a team of eight. Tom wasn't there himself. I called him and he said two of the team were off sick and the other two had been "reassigned to another job." He assured me they could still get it done.

17 July 2025 (Installation Deadline — 5:00 PM): By 5:00 PM, the marquee structure was erected but the flooring was only half-laid, the lighting had not been installed, and the furniture had not been delivered. I called Tom repeatedly — he eventually answered at about 7 PM and said the furniture was "stuck in their warehouse" and the lighting rig had been damaged in transit. He said they would "sort it out" on 18 July.

18 July 2025: The Luxe team returned at 8:00 AM. They finished the flooring by lunchtime. The lighting was installed by about 4:00 PM but it was not the LED festoon lighting specified in the contract — it was basic halogen flood lighting which looked completely wrong for the event. The furniture arrived at about 5:00 PM but it was the wrong specification — they delivered folding plastic chairs and basic trestle tables instead of the premium wooden furniture specified in the contract.

I was furious. I called Tom and told him this was completely unacceptable. He said the correct furniture and lighting "weren't available" and this was "the best they could do at short notice." He offered a 10% discount, which I refused.

18 July 2025 (Evening): With the event the next day and no time to find alternative furniture and lighting suppliers, I had to make emergency arrangements:

- I hired replacement premium furniture (tables and chairs for 500) from Elegant Hire Ltd at a cost of £12,500 plus VAT, delivered overnight.
- I hired replacement LED festoon lighting from Brightside Event Lighting at a cost of £3,800 plus VAT, installed early morning of 19 July.
- My own staff worked through the night to remove the wrong furniture and lighting and set up the replacements. I had to pay £2,400 in overtime to my team (6 staff x 8 hours overtime at £50/hour — this is what I actually paid them, it's documented in our payroll).

19 July 2025 (Event Day): The event went ahead but there were problems:

- The replacement furniture was good but not identical to what had been promised to our client. The table arrangements were slightly different and some of the client's seating plans had to be reworked on the day.
- The marquee structure itself, while erected, had several visible defects — two of the silk lining panels were torn, and there was a noticeable sag in the roof structure on one side which looked unprofessional. We tried to disguise this with additional draping but it was visible in photos.
- The flooring developed a significant creak and flex in the central area during the event, particularly when guests were dancing. One guest tripped on an uneven section and fell, though fortunately was not injured beyond bruising.

After the Event:

- Harringtons plc were unhappy with the event. Their Head of Communications, Mark Dunn, emailed me on 22 July saying the venue "fell below the standard we expected" and that the CEO had been "embarrassed" by the visible marquee defects. While they have not formally claimed damages, they have told us they will not be using Fairway Events for their 2026 gala — this contract was worth approximately £65,000 per year to us. Mark's exact words in the email were: "We won't be renewing the arrangement for next year. The venue issues reflected badly on us and we need a provider we can rely on."

- I have not paid the outstanding balance of £33,600 + VAT to Luxe Marquees. I do not believe I should have to pay anything further and in fact believe they owe me money.

- On 15 August 2025, Luxe sent me an invoice for the outstanding balance of £33,600 + VAT with a covering letter demanding payment within 14 days. I did not respond.

- On 10 September 2025, Luxe sent a second letter threatening legal action if the balance was not paid within 7 days. I forwarded this to Catherine at the time and she said to sit tight and she would deal with it.

- On 2 October 2025, Luxe's solicitors (Barker & Co) sent a Letter Before Action to us claiming the full outstanding balance of £33,600 + VAT (£40,320). I have attached a copy. The letter gives us 14 days to respond.

- We did not respond to that letter. Catherine was on maternity leave by then and I didn't know who else to contact. I'm embarrassed to say that nothing has happened since. It's now February 2026 and I've heard nothing further from Luxe or their solicitors.

What I Want

I want to fight this. I don't think I owe them anything. In fact, I think they owe me. Specifically:

1. I want to counterclaim for my losses: the cost of replacement furniture (£12,500), replacement lighting (£3,800), overtime for my staff (£2,400), and the liquidated damages for late installation (I think that's £2,000 for one day's delay — 17 July to 18 July).

2. I want to claim for the loss of the Harringtons contract — that's £65,000 per year. I'm not sure how many years I can claim but we'd had the contract for three years running and there was no reason to think it wouldn't continue.

3. I want to recover the £14,400 + VAT deposit I already paid, since they completely failed to deliver what they promised.

4. I also want to know whether the guest who tripped is likely to come after us, and whether we can pass that on to Luxe if they do.

Can you please draft a Letter Before Action to Luxe Marquees setting out our position and our claims? Catherine said you should also prepare a short advice note for me setting out the strengths and weaknesses of our position — I want to be realistic about what we can actually recover.

Kind regards,

Rebecca Haines
Operations Director
Fairway Events Ltd
The Courtyard, Edgbaston, Birmingham, B15 3ES
Tel: 0121 456 7890
Email: rebecca@fairwayevents.co.uk`

const LBA_OTHER_SIDE_TEXT = `BARKER & CO SOLICITORS

14 Queen Street, Solihull, West Midlands, B91 3AB
Tel: 0121 789 0123 | Fax: 0121 789 0124
Email: litigation@barkerandco.co.uk
DX: 14567 Solihull

LETTER BEFORE ACTION

Sent by email and first class post

Date: 2 October 2025
Our Ref: NW/LM/2025/0847
Your Ref: —

FAO: The Directors
Fairway Events Ltd
The Courtyard
Edgbaston
Birmingham
B15 3ES

Dear Sirs,

Re: Luxe Marquees Ltd — Outstanding Invoice — Claim for Payment

We act for Luxe Marquees Ltd ("our client") in connection with an outstanding debt owed by Fairway Events Ltd ("your company") under a contract for the supply of marquee structures and associated equipment dated 14 March 2025 (the "Contract").

This letter constitutes a Letter Before Action in accordance with the Practice Direction — Pre-Action Conduct and Protocols and the Pre-Action Protocol for Debt Claims.

The Claim

1. Under the Contract, our client agreed to supply and install a marquee structure, flooring, lighting and furniture for an event at Langley Park Estate, Warwick, on 19 July 2025.

2. The total contract price was £48,000 plus VAT (£57,600).

3. Your company paid a deposit of £14,400 plus VAT (£17,280) on 18 March 2025.

4. The balance of £33,600 plus VAT (£40,320) was due within 14 days of the event, i.e. by 2 August 2025.

5. Our client duly supplied and installed the marquee and associated equipment in accordance with the Contract. The event took place as planned on 19 July 2025.

6. Despite our client's invoice dated 15 August 2025 and a further demand dated 10 September 2025, the outstanding balance of £40,320 remains unpaid.

7. Our client is also entitled to contractual interest at the rate of 4% above the Bank of England base rate on the outstanding balance from the due date. As at the date of this letter, interest accrued amounts to approximately £538.

Total Amount Claimed

Outstanding balance (including VAT): £40,320.00
Contractual interest (to date of this letter): £538.00
Total: £40,858.00

Interest continues to accrue at a daily rate of approximately £6.65.

Response Required

We require your company to:

1. Pay the total amount of £40,858.00 within 14 days of the date of this letter (i.e. by 16 October 2025); or

2. Provide a full written response setting out your company's position, including any defence or counterclaim, within the same period.

Consequences of Non-Response

If we do not receive payment or a substantive response within 14 days, our client will commence court proceedings against your company without further notice. In those proceedings, our client will seek:

(a) The outstanding balance of £40,320.00;
(b) Contractual interest;
(c) Costs of the proceedings, including solicitors' costs on an indemnity basis if appropriate.

We draw your attention to the Practice Direction — Pre-Action Conduct and Protocols, which requires parties to exchange sufficient information to understand each other's position, make attempts to resolve the dispute without litigation, and consider alternative dispute resolution. Failure to comply with the spirit of the pre-action protocols may be taken into account by the court when making orders as to costs.

Alternative Dispute Resolution

Our client is willing in principle to engage in mediation or other forms of alternative dispute resolution as an alternative to court proceedings, provided your company first acknowledges the debt or provides a substantive response to this letter.

Information Enclosed

In accordance with the Pre-Action Protocol for Debt Claims, we enclose:

1. A copy of the Contract dated 14 March 2025;
2. A copy of our client's invoice dated 15 August 2025;
3. A statement of account showing the amount owed and interest calculation;
4. An Information Sheet and Reply Form as required by the Protocol.

We also enclose a Financial Statement form. If your company is unable to pay the full amount, please complete and return this form so that our client can consider your company's financial position.

Dispute

If your company disputes the claim, your response should set out:

(a) The reasons why the sum is not owed;
(b) Full details of any defence relied upon;
(c) Full details of any counterclaim, including the amount claimed and the basis for the counterclaim;
(d) Details of any documents on which your company relies.

We look forward to hearing from you within 14 days.

Yours faithfully,

BARKER & CO SOLICITORS

N. Walker
Partner — Litigation Department

Barker & Co Solicitors is authorised and regulated by the Solicitors Regulation Authority (SRA No. 567890).`

const LBA_CONTRACT_TEXT = `CONTRACT FOR THE SUPPLY OF MARQUEE STRUCTURES AND ASSOCIATED EQUIPMENT

Date: 14 March 2025

Between:

(1) LUXE MARQUEES LTD (Company No. 10987654), whose registered office is at 28 Stratford Road, Shirley, Solihull, West Midlands, B90 3BH ("the Supplier")

(2) FAIRWAY EVENTS LTD (Company No. 11234567), whose registered office is at The Courtyard, Edgbaston, Birmingham, B15 3ES ("the Client")

1. Definitions

1.1 In this Agreement:

"the Event" means the corporate gala event to be held at Langley Park Estate, Langley Road, Warwick, CV34 5TH on 19 July 2025.

"the Equipment" means the marquee structure, flooring, lighting and furniture as specified in Schedule 1.

"the Installation Date" means 17 July 2025.

"the Contract Price" means £48,000 plus VAT.

2. Supply and Installation

2.1 The Supplier shall supply, deliver to site and install the Equipment at Langley Park Estate in accordance with the specification set out in Schedule 1.

2.2 Installation shall be completed no later than 5:00 PM on the Installation Date. Time is of the essence in respect of this obligation.

2.3 The Supplier shall provide all necessary labour, tools and transport required for the delivery and installation of the Equipment.

2.4 The Supplier shall remove all Equipment from the site within 48 hours of the conclusion of the Event.

3. Quality and Specification

3.1 All Equipment supplied under this Agreement shall be of satisfactory quality, fit for purpose and free from material defects.

3.2 The Equipment shall conform in all material respects to the specification set out in Schedule 1.

3.3 If any Equipment does not conform to the requirements of clauses 3.1 or 3.2, the Client shall be entitled to require the Supplier to replace or rectify the non-conforming Equipment at the Supplier's cost, without prejudice to any other remedies available to the Client.

4. Price and Payment

4.1 The Contract Price shall be £48,000 plus VAT at the applicable rate.

4.2 Payment shall be made as follows:

(a) A deposit of 30% of the Contract Price (£14,400 plus VAT) shall be payable on signing of this Agreement.

(b) The balance of 70% of the Contract Price (£33,600 plus VAT) shall be payable within 14 days of the date of the Event.

4.3 All payments shall be made by bank transfer to the account details notified by the Supplier.

4.4 If any sum payable under this Agreement is not paid by the due date, the Supplier shall be entitled to charge interest on the overdue amount at the rate of 4% per annum above the Bank of England base rate from the due date until payment is made in full, whether before or after judgment.

5. Delay and Liquidated Damages

5.1 If the Supplier fails to complete installation of the Equipment by 5:00 PM on the Installation Date, the Client shall be entitled to deduct from the Contract Price the sum of £2,000 per day (or part thereof) for each day of delay, up to a maximum of £10,000.

5.2 The parties agree that the sums specified in clause 5.1 represent a genuine pre-estimate of the loss that the Client would suffer as a result of delay in installation and are not a penalty.

5.3 The Client's right to liquidated damages under this clause is without prejudice to any other rights or remedies available to the Client under this Agreement or at law.

6. Indemnity

6.1 The Supplier shall indemnify the Client against all losses, damages, costs and expenses (including legal costs) arising from or in connection with:

(a) any breach by the Supplier of its obligations under this Agreement;

(b) any defect in the Equipment;

(c) any negligent act or omission of the Supplier, its employees, agents or subcontractors in connection with the supply, installation or removal of the Equipment.

7. Insurance

7.1 The Supplier shall maintain throughout the term of this Agreement:

(a) Public liability insurance with a minimum cover of £5,000,000;

(b) Employer's liability insurance as required by law;

(c) Product liability insurance with a minimum cover of £5,000,000.

7.2 The Supplier shall provide evidence of such insurance to the Client on request.

8. Termination

8.1 Either party may terminate this Agreement by giving written notice to the other party if the other party commits a material breach of this Agreement and (where such breach is capable of remedy) fails to remedy such breach within 14 days of receiving written notice requiring it to do so.

8.2 The Client may terminate this Agreement immediately by giving written notice to the Supplier if:

(a) the Supplier fails to complete installation by the Installation Date; or

(b) it becomes apparent that the Supplier will be unable to complete installation by the Installation Date.

9. General

9.1 This Agreement constitutes the entire agreement between the parties.

9.2 No variation of this Agreement shall be effective unless made in writing and signed by both parties.

9.3 This Agreement shall be governed by and construed in accordance with the laws of England and Wales.

9.4 The courts of England and Wales shall have exclusive jurisdiction in relation to any dispute arising out of or in connection with this Agreement.

SCHEDULE 1 — EQUIPMENT SPECIFICATION

Marquee structure: Premium clearspan marquee, 30m x 20m, white PVC roof, capacity 500 guests, integrated guttering (1)
Flooring: Engineered oak-effect wooden flooring, full coverage (600 sq m), level base with sub-frame (full coverage)
Lighting: LED festoon lighting, warm white, draped throughout marquee interior; 6 x LED uplighters (colour-changeable); 2 x chandelier-style LED pendant fixtures at centre points
Silk linings: Ivory silk pleated linings to all interior walls and ceiling (full coverage)
Tables: Round wooden banqueting tables, seats 10, 180cm diameter, dark oak finish (50)
Chairs: Wooden cross-back chairs, dark oak finish, ivory seat cushions (500)
Other: 1 x wooden dance floor (8m x 8m, parquet effect); 1 x raised stage platform (6m x 4m x 0.6m); power distribution board with 63A supply

Signed for and on behalf of Luxe Marquees Ltd:
Name: Thomas Bradley, Director
Date: 14 March 2025

Signed for and on behalf of Fairway Events Ltd:
Name: Rebecca Haines, Director
Date: 14 March 2025`

const LBA_IDEAL_LBA_TEXT = `[YOUR FIRM]

[Address]
Tel: [Number] | Email: [Email]
DX: [Number]

LETTER BEFORE ACTION

Sent by email and first class post

Date: [Date — February 2026]
Our Ref: CO/FE/2026/[Ref]
Your Ref: NW/LM/2025/0847

FAO: N. Walker, Partner
Barker & Co Solicitors
14 Queen Street
Solihull
West Midlands
B91 3AB

By email: litigation@barkerandco.co.uk

AND TO:

The Directors
Luxe Marquees Ltd
28 Stratford Road
Shirley, Solihull
West Midlands
B90 3BH

Dear Sirs,

Re: Fairway Events Ltd v Luxe Marquees Ltd — Contract dated 14 March 2025 — Breach of Contract and Counterclaim

We act for Fairway Events Ltd ("our client") in connection with the matters arising under the contract dated 14 March 2025 between our client and your client, Luxe Marquees Ltd ("the Contract"), for the supply and installation of marquee structures and associated equipment for a corporate event at Langley Park Estate, Warwick, on 19 July 2025.

This letter constitutes a Letter Before Action in accordance with the Practice Direction — Pre-Action Conduct and Protocols and serves as our client's response to your Letter Before Action dated 2 October 2025 (your ref: NW/LM/2025/0847) and as notification of our client's counterclaim.

We note that a considerable period has elapsed since your letter of 2 October 2025. Our client did not have the benefit of legal representation at the time your letter was received and we apologise for the delay in responding. We trust that this full and detailed response addresses the requirements of the pre-action protocol.

1. Response to Your Client's Claim

Our client disputes the claim for the outstanding balance of £33,600 plus VAT (£40,320) in its entirety. Our client is entitled to withhold payment by reason of the matters set out below and counterclaims for losses substantially exceeding the amount claimed by your client.

2. Summary of Breaches

Your client committed multiple breaches of the Contract, as follows:

2.1 Late Installation (Breach of Clause 2.2)

The Contract required installation to be completed by 5:00 PM on 17 July 2025. Time was expressly stated to be of the essence. Installation was not completed by this deadline. The flooring was only half-laid, the lighting had not been installed, and the furniture had not been delivered. Installation was not substantially completed until the afternoon/evening of 18 July 2025 — one full day late.

2.2 Supply of Non-Conforming Equipment (Breach of Clauses 3.1 and 3.2)

The Contract specified premium LED festoon lighting, warm white, together with LED uplighters and chandelier-style LED pendant fixtures (Schedule 1). Your client installed basic halogen flood lighting which did not conform to the specification.

The Contract specified round wooden banqueting tables (180cm diameter, dark oak finish) and wooden cross-back chairs with ivory seat cushions (Schedule 1). Your client delivered folding plastic chairs and basic trestle tables which did not conform to the specification.

2.3 Defective Installation (Breach of Clauses 3.1 and 3.2)

Even where Equipment was supplied in accordance with the specification:

(a) Two silk lining panels were torn, which was visible to guests and in photographs.

(b) The marquee roof structure had a noticeable sag on one side.

(c) The flooring developed a significant creak and flex in the central area during the event, and one guest tripped on an uneven section.

2.4 Inadequate Labour and Resources

Your client provided a team of four workers for the installation instead of the eight previously confirmed.

3. Our Client's Counterclaim

3.1 Liquidated Damages for Late Installation

Under Clause 5.1 of the Contract, our client is entitled to deduct £2,000 per day for each day of delay.

Liquidated damages claimed: £2,000

3.2 Cost of Replacement Furniture

Due to your client's failure to supply furniture conforming to the contractual specification, our client was forced to hire replacement premium furniture at short notice from Elegant Hire Ltd.

Cost: £12,500 plus VAT (£15,000)

3.3 Cost of Replacement Lighting

Due to your client's failure to supply lighting conforming to the contractual specification, our client was forced to hire replacement LED festoon lighting at short notice from Brightside Event Lighting.

Cost: £3,800 plus VAT (£4,560)

3.4 Staff Overtime Costs

Our client's staff were required to work through the night of 18–19 July to remove the non-conforming furniture and lighting and install the replacements.

Cost: £2,400

3.5 Recovery of Deposit

Given the extent and seriousness of the breaches, our client contends that the failures by your client were so fundamental as to amount to a repudiatory breach of the Contract. Our client is entitled to recover the deposit of £14,400 plus VAT (£17,280) already paid.

In the alternative, if it is held that your client is entitled to some payment under the Contract, our client will set off the losses claimed below against any sum found to be due.

Deposit recovery claimed: £14,400 plus VAT (£17,280)

3.6 Loss of Client Contract — Consequential Loss

As a direct and foreseeable consequence of your client's breaches, our client's end-client, Harringtons plc, was dissatisfied with the event. Harringtons plc has confirmed in writing that it will not be engaging our client for its 2026 annual gala event, a contract worth approximately £65,000 per year.

Our client claims damages in respect of the lost profit on the Harringtons plc contract. Our client reserves the right to quantify this loss precisely at a later stage.

Loss of Harringtons contract claimed: to be quantified — estimated at a minimum of £65,000 (one year's lost revenue, subject to adjustment for avoided costs)

4. Summary of Counterclaim

Liquidated damages (1 day late installation): £2,000.00
Replacement furniture (Elegant Hire Ltd): £15,000.00 (incl. VAT)
Replacement lighting (Brightside Event Lighting): £4,560.00 (incl. VAT)
Staff overtime: £2,400.00
Recovery of deposit: £17,280.00 (incl. VAT)
Loss of Harringtons plc contract (to be quantified): est. £65,000+
Sub-total (excluding Harringtons loss): £41,240.00
Total (including estimated Harringtons loss): £106,240.00+

5. Set-Off

Our client is entitled to and does set off the sums claimed above against any amount which might otherwise be payable to your client under the Contract. No sum is due from our client to your client.

6. Documents Relied Upon

1. Contract dated 14 March 2025
2. Email from Tom Bradley dated 3 July 2025
3. Email correspondence between the parties dated 16–18 July 2025
4. Invoice from Elegant Hire Ltd (replacement furniture)
5. Invoice from Brightside Event Lighting (replacement lighting)
6. Payroll records confirming overtime payments
7. Email from Mark Dunn (Harringtons plc) dated 22 July 2025
8. Photographs of the event showing marquee defects

7. Pre-Action Protocol Compliance

In accordance with the Practice Direction — Pre-Action Conduct and Protocols:

(a) Parties: The claim and counterclaim are between Fairway Events Ltd and Luxe Marquees Ltd.
(b) Basis of claim: Breach of contract (Clauses 2.2, 3.1 and 3.2 of the Contract).
(c) Summary of facts: As set out above.
(d) Remedy sought: Payment of our client's counterclaim, set off against any sum claimed by your client.
(e) Documents: As listed in Section 6 above.

8. Alternative Dispute Resolution

Our client is willing to engage in mediation or other forms of alternative dispute resolution in an attempt to resolve this matter without recourse to court proceedings.

We draw your attention to the court's encouragement of ADR under the Civil Procedure Rules and the potential costs consequences of an unreasonable refusal to engage in ADR (see Halsey v Milton Keynes General NHS Trust [2004] EWCA Civ 576).

9. Response

We require a substantive response to this letter within 14 days.

If we do not receive a satisfactory response, our client will commence proceedings without further notice.

Yours faithfully,

[YOUR FIRM]

Catherine Osei
Partner — Litigation Department`

const LBA_IDEAL_ADVICE_TEXT = `ADVICE NOTE — CONFIDENTIAL

To: Rebecca Haines, Operations Director — Fairway Events Ltd
From: [Trainee Solicitor], supervised by Catherine Osei, Partner
Date: [Date — February 2026]
Re: Fairway Events Ltd — Claim and Counterclaim against Luxe Marquees Ltd

1. Purpose

You have asked us to advise on the strengths and weaknesses of your position in relation to the outstanding dispute with Luxe Marquees Ltd.

2. Your Defence to Luxe's Claim (£40,320)

Strength: Strong

You have a strong defence based on Luxe's multiple breaches of contract. Even if Luxe were entitled to some payment, you are entitled to set off your counterclaim against the balance due. Your counterclaim (excluding the Harringtons loss) is worth approximately £41,240 — which exceeds Luxe's claim.

Risk factor: Luxe will likely argue they substantially performed the contract and that you should have mitigated.

3. Your Counterclaim — Assessment by Head of Loss

3.1 Liquidated Damages — £2,000

Strength: Very strong

Clear liquidated damages clause (Clause 5.1), time was of the essence (Clause 2.2). One full day late. The clause states it is a genuine pre-estimate of loss, making it unlikely to be challenged as a penalty under Cavendish Square Holding BV v Talal El Makdessi [2015] UKSC 67.

Our assessment: Recoverable — high confidence.

3.2 Replacement Furniture — £12,500 + VAT

Strength: Strong

Clear breach of Clauses 3.1 and 3.2. Clause 3.3 expressly preserves right to require replacement. Cost appears reasonable for emergency hire for 500 guests.

Risk: Luxe may argue you should have given them an opportunity to rectify. However, with the event the following day, there was no realistic opportunity.

Our assessment: Recoverable — high confidence.

3.3 Replacement Lighting — £3,800 + VAT

Strength: Strong. Same analysis as furniture.

Our assessment: Recoverable — high confidence.

3.4 Staff Overtime — £2,400

Strength: Moderate to strong

Necessary to remove non-conforming equipment and install replacements overnight. Documented through payroll.

Risk: Luxe may challenge whether 48 hours of overtime was reasonable.

Our assessment: Likely recoverable, though hours may be scrutinised.

3.5 Recovery of Deposit — £14,400 + VAT

Strength: Moderate — this is the most contentious head of claim

Depends on establishing either total failure of consideration (difficult — marquee was erected and event took place) or repudiatory breach (arguable but risky — you continued to use the marquee, which may constitute affirmation).

Risk: This is the weakest head. A court may find the breaches did not amount to repudiatory breach.

Our assessment: Uncertain — 40–50% prospects. However, even without the deposit, your other losses exceed Luxe's claim via set-off.

3.6 Loss of Harringtons plc Contract — est. £65,000+

Strength: Moderate — the most valuable but most difficult head

This is consequential loss. The test is remoteness: was this loss within the reasonable contemplation of the parties at the time the contract was made? (Hadley v Baxendale (1854) 9 Exch 341; Victoria Laundry (Windsor) Ltd v Newman Industries Ltd [1949] 2 KB 528; Transfield Shipping Inc v Mercator Shipping Inc (The Achilleas) [2008] UKHL 48.)

Arguments in favour: Luxe knew the equipment was for a major corporate event; foreseeable that poor delivery could damage reputation; documentary evidence of loss (Mark Dunn's email); three-year track record.

Arguments against: Specific loss of a named future client contract may be too remote — Luxe was not told about Harringtons or its value; quantification uncertain — you cannot claim £65,000 revenue, you must prove lost profit (revenue minus costs); mitigation — have you sought replacement business?; claiming multiple years would be speculative.

Our assessment: 50–60% prospects of recovering some consequential loss, likely less than full £65,000. Realistic recovery: £20,000–£40,000 if remoteness argument is overcome.

4. The Guest Who Tripped — Third-Party Liability

Risk of a claim against you: The guest suffered minor bruising. A personal injury claim is possible but the injury appears minor.

Passing liability to Luxe: The contract contains an indemnity clause (Clause 6.1) covering defects in Equipment and negligent acts. Strong indemnity claim against Luxe. Additionally, a contribution claim under the Civil Liability (Contribution) Act 1978.

Recommended action: Check whether the guest has been in contact. If a claim materialises, notify your public liability insurer immediately and we will pursue the indemnity against Luxe.

5. Procedural Considerations

5.1 Limitation: 6 years from breach (Limitation Act 1980, s.5). Well within time — expires July 2031.

5.2 Court and Track: Excluding Harringtons loss, claim is approximately £41,240 (fast track). Including Harringtons, could exceed £100,000 (multi-track — higher costs).

5.3 Pre-action protocol: Delay in responding to October 2025 LBA is not ideal but unlikely to have serious consequences now that we are engaging fully.

5.4 ADR: We have proposed mediation. Strongly recommended — quicker, cheaper, less adversarial. Unreasonable refusal has costs consequences (Halsey v Milton Keynes).

5.5 Costs: If successful, typically recover 60–70% of costs on standard basis. Shortfall remains your liability.

6. Overall Assessment and Recommendation

Best-case: Full recovery approximately £106,240+ minus £40,320 = net £65,920+.
Realistic: Recovery of replacement costs, overtime and LDs (£23,960) set off against £40,320. You owe nothing. Some Harringtons recovery possible. Net recovery above set-off: £20,000–£50,000.
Worst-case: Court finds Luxe substantially performed; you owe a reduced balance after LD deduction. Low probability.

Settlement recommendation: Luxe waives the £40,320 balance; Luxe pays £20,000–£40,000 contribution to your losses; each party bears own costs.

7. Next Steps

1. Review and approve the enclosed LBA
2. Confirm whether the guest who tripped has been in contact
3. Provide profit margin data on the Harringtons contract (revenue minus direct costs)
4. Confirm whether you have taken on replacement clients since July 2025 (mitigation)
5. Obtain a comparative quote for emergency furniture hire for 500 guests

This advice is given on the basis of the information currently available and may need to be revised if further facts come to light. This advice is protected by legal professional privilege and should not be disclosed to the other side.`

const LBA_EXERCISE_MARKDOWN = `# Letter Before Action — Training Exercise

## Background

You are a trainee solicitor in the litigation department at your firm. Your supervising partner, **Catherine Osei**, has asked you to handle a dispute between your client, **Fairway Events Ltd**, and a supplier, **Luxe Marquees Ltd**.

Fairway Events is an events management company that hired Luxe Marquees to supply and install a premium marquee with flooring, lighting and furniture for a major corporate gala event. Luxe's performance was seriously deficient — late installation, wrong equipment delivered, and defective workmanship.

Luxe Marquees (through their solicitors, Barker & Co) has sent a Letter Before Action claiming the outstanding balance of **£40,320** for unpaid invoices. Your client disputes the claim and wants to counterclaim for their losses.

## Your Role

You have been asked to:

1. **Draft a Letter Before Action** on behalf of Fairway Events, responding to Barker & Co's claim and setting out the defence and counterclaim
2. **Prepare a client advice note** assessing the strengths and weaknesses of each head of claim and recommending a strategy

## Documents Provided

- **Client Instruction Email** — Detailed factual background from Rebecca Haines (Operations Director, Fairway Events)
- **Letter Before Action from Barker & Co** — The other side's claim on behalf of Luxe Marquees
- **The Contract** — The underlying agreement between Fairway Events and Luxe Marquees

## Key Areas of Law

- Contract law — breach, repudiation, remoteness (*Hadley v Baxendale*), mitigation
- Liquidated damages vs penalties (*Makdessi*)
- Pre-Action Protocol for Debt Claims
- Practice Direction — Pre-Action Conduct and Protocols
- ADR and costs consequences (*Halsey v Milton Keynes*)
- Limitation (Limitation Act 1980)
- Indemnity and contribution (Civil Liability (Contribution) Act 1978)

## How This Exercise Works

1. **Step 1 — Review:** Read the client instructions, Barker & Co's LBA, and the contract
2. **Step 2 — Draft LBA:** Produce a protocol-compliant Letter Before Action with defence and counterclaim
3. **Step 3 — Advice Note:** Produce a balanced client advice note with strengths, weaknesses, and strategy

You may ask questions at any time using the chat panel — this simulates asking Catherine Osei for guidance.

## Key Tips

- **Check the contract** — every head of loss should be tied to a specific clause
- **Separate the LBA from the advice** — the LBA is seen by the other side (no weaknesses or strategy); the advice note is privileged (be candid)
- **Be realistic** — the client wants to know what she can actually recover, not just what she wants to hear
- **Don't forget ADR** — the court expects you to propose it
- **Revenue ≠ profit** — the Harringtons claim needs careful treatment
- **Address the delay** — your client didn't respond to the October LBA

**Take your time.** This exercise is designed to take 5–7 hours. Quality and judgment matter more than speed.

---

*Good luck!*`

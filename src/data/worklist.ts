import type { TeamMember, WorklistBlock } from '../types';

// ---------------------------------------------------------------------------
// The morning work queue. Every task is raised by a rule reading the five
// systems, and every figure cited here already appears inside its campaign
// workspace: nothing in this file introduces a new number.
//
// Albert Street items sit on its real REA report; its Box+Dice and Red HQ
// layers are modelled and say so line by line. Every other campaign is
// illustrative, as on the portfolio screen.
//
// The team is illustrative apart from the signed-in agent.
// ---------------------------------------------------------------------------

export const team: TeamMember[] = [
  {
    id: 'ranko',
    name: 'Ranko Cvjeticanin',
    firstName: 'Ranko',
    patch: 'East Melbourne',
  },
  {
    id: 'annabel',
    name: 'Annabel Hartley',
    firstName: 'Annabel',
    patch: 'Armadale',
  },
  {
    id: 'tom',
    name: 'Tom Whelan',
    firstName: 'Tom',
    patch: 'Toorak',
  },
  {
    id: 'priya',
    name: 'Priya Nair',
    firstName: 'Priya',
    patch: 'Prahran and South Yarra',
  },
];

export const worklist: WorklistBlock = {
  title: 'Today',
  subtitle:
    'The work the systems raised overnight, across every live campaign, with the reason each item fired.',
  allLabel: 'Whole team',
  raisedNote: 'Raised by the 6:00am read across the five systems.',
  notifyPrefix: 'Email this to',
  caption:
    '102/380 Albert Street items are built on its real REA report; its Box+Dice and Red HQ layers are modelled and marked line by line. Items on the other campaigns are illustrative, as is the team apart from the signed-in agent.',
  tasks: [
    {
      id: 'albert-call-warm',
      campaignId: 'albert',
      campaignAddress: '102/380 Albert Street, East Melbourne',
      assigneeId: 'ranko',
      urgency: 'now',
      urgencyLabel: 'Do now',
      action: 'Call the 11 warm enquirers in Box+Dice',
      detail: 'Priority order: enquired, never inspected.',
      evidence: [
        { system: 'REA Ignite', fact: '8 enquiries in the week of 20–26 Jul, from the real report' },
        { system: 'REA Ignite', fact: '0 inspection actions in the same week' },
        { system: 'Box+Dice CRM', fact: '11 enquirers have no inspection logged. Modelled.' },
      ],
      rule: 'Raised when a week records five or more enquiries and no inspection action.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'moorhouse-reply',
      campaignId: 'moorhouse',
      campaignAddress: '7 Moorhouse Street, Armadale',
      assigneeId: 'annabel',
      urgency: 'now',
      urgencyLabel: 'Do now',
      action: 'Reply to the six unanswered enquiries, oldest first',
      detail: 'Two are past four days.',
      evidence: [
        { system: 'Box+Dice CRM', fact: '6 enquiries are awaiting a first reply; the oldest has waited four days' },
        { system: 'Domain Skylight', fact: '9 enquiries this week, the strongest week of the campaign' },
      ],
      rule: 'Raised when any enquiry waits past 24 hours without a reply.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'moorhouse-ofi-notes',
      campaignId: 'moorhouse',
      campaignAddress: '7 Moorhouse Street, Armadale',
      assigneeId: 'annabel',
      urgency: 'today',
      urgencyLabel: 'Today',
      action: 'Log follow-up notes for Saturday’s OFI',
      detail: '9 groups attended; 4 have notes.',
      evidence: [
        { system: 'Box+Dice CRM', fact: '5 of 9 Saturday groups have no follow-up note' },
        { system: 'Box+Dice CRM', fact: 'Auction is six days out, Saturday 1 August' },
      ],
      rule: 'Raised when OFI notes are still missing 48 hours after the open.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'albert-vendor-price',
      campaignId: 'albert',
      campaignAddress: '102/380 Albert Street, East Melbourne',
      assigneeId: 'ranko',
      urgency: 'today',
      urgencyLabel: 'Today',
      action: 'Book the vendor meeting for the price conversation',
      detail: 'Bring the saves-to-views evidence and the feedback notes.',
      evidence: [
        { system: 'Box+Dice CRM', fact: '29 of 47 logged feedback notes cite price expectation. Modelled.' },
        { system: 'REA Ignite', fact: '322 days on site, 287 past the standard cycle' },
      ],
      rule: 'Raised when one feedback theme passes half of logged notes.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'mathoura-guide',
      campaignId: 'mathoura',
      campaignAddress: '4/27 Mathoura Road, Toorak',
      assigneeId: 'tom',
      urgency: 'today',
      urgencyLabel: 'Today',
      action: 'Book the guide review with the vendor',
      detail: 'Bring the feedback-note evidence and the two comparable sales.',
      evidence: [
        { system: 'Marshall White historical', fact: 'Enquiry-to-inspection conversion sits below the cohort band at day 61' },
        { system: 'Google Analytics', fact: 'Listing page dwell holds at 2:24, so interest is real and the blocker is price' },
      ],
      rule: 'Raised when conversion trails the cohort for two consecutive weeks.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'albert-refresh',
      campaignId: 'albert',
      campaignAddress: '102/380 Albert Street, East Melbourne',
      assigneeId: 'ranko',
      urgency: 'week',
      urgencyLabel: 'This week',
      action: 'Price the photo and video refresh for the vendor meeting',
      detail: 'Pair it with the price conversation, not before it.',
      evidence: [
        { system: 'REA Ignite', fact: 'Video, 3D tour and walkthrough all show zero views' },
        { system: 'Red HQ', fact: 'No refresh product purchased in the campaign to date. Modelled.' },
      ],
      rule: 'Raised when a campaign passes the standard cycle with unused media levers.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'huntingtower-calldown',
      campaignId: 'huntingtower',
      campaignAddress: '12 Huntingtower Road, Armadale',
      assigneeId: 'annabel',
      urgency: 'week',
      urgencyLabel: 'This week',
      action: 'Start the pre-auction call-down',
      detail: '30 qualified enquirers on the list.',
      evidence: [
        { system: 'Box+Dice CRM', fact: '30 qualified enquirers; auction is 13 days out, Saturday 8 August' },
        { system: 'Marshall White historical', fact: 'Call-downs land best inside the final fortnight' },
      ],
      rule: 'Raised 14 days before auction day.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'williams-appraisal',
      campaignId: 'williams',
      campaignAddress: '3/158 Williams Road, Prahran',
      assigneeId: 'priya',
      urgency: 'week',
      urgencyLabel: 'This week',
      action: 'Attach the rental appraisal to the listing',
      detail: 'Answers 6 of 14 early enquiries at once.',
      evidence: [
        { system: 'Box+Dice CRM', fact: '6 of 14 enquiries asked about rental return' },
      ],
      rule: 'Raised when one question recurs in a third of enquiries.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'daly-finance',
      campaignId: 'daly',
      campaignAddress: '216/8 Daly Street, South Yarra',
      assigneeId: 'priya',
      urgency: 'week',
      urgencyLabel: 'This week',
      action: 'Call the two finance-pending buyers',
      detail: 'Set a weekly touch until approval.',
      evidence: [
        { system: 'Box+Dice CRM', fact: 'Both buyers are waiting on approvals; last contact was eight days ago' },
        { system: 'Domain Skylight', fact: '4 enquiries this week and saves are flat across the fortnight' },
      ],
      rule: 'Raised when a warm buyer goes seven days without contact.',
      raised: 'Raised by the 6:00am read',
    },
  ],
};

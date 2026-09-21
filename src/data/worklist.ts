import type { BudgetBandMeta, TaskBudget, TeamMember, WorklistBlock } from '../types';

// ---------------------------------------------------------------------------
// The morning work queue. Every task is raised by a rule reading the five
// systems, and every figure cited here already appears inside its campaign
// workspace: nothing in this file introduces a new number.
//
// Every task carries a budget band. The office reads the queue by budget first,
// because that decides the route: a no-budget item goes straight to the agent,
// anything with spend has to clear the vendor. The bands and their dollar
// labels are the same three the campaign recommendations use.
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

export const budgetBands: BudgetBandMeta[] = [
  {
    id: 'none',
    label: 'No additional budget',
    short: 'No budget',
    note: 'Nothing to approve. These can go to the agent as they are.',
  },
  {
    id: 'mid',
    label: '$1,000–$2,000',
    short: '$1–2k',
    note: 'Needs the vendor to approve the spend before the agent books it.',
  },
  {
    id: 'high',
    label: '$3,000+',
    short: '$3k+',
    note: 'Needs a vendor meeting, not an email. Take the evidence in with you.',
  },
];

// Written once so the queue and the campaign recommendations cannot drift apart.
const noBudget = (note: string): TaskBudget => ({ band: 'none', cost: 'No cost', note });
const mid = (cost: string, note: string): TaskBudget => ({ band: 'mid', cost, note });
const high = (cost: string, note: string): TaskBudget => ({ band: 'high', cost, note });

export const worklist: WorklistBlock = {
  title: 'Today',
  subtitle:
    'The work the systems raised overnight, across every live campaign, grouped by what it costs the vendor.',
  allLabel: 'Whole team',
  allCampaignsLabel: 'All campaigns',
  teamFilterLabel: 'Agent',
  campaignFilterLabel: 'Campaign',
  budgetFilterLabel: 'Budget',
  budgetBands,
  raisedNote: 'Raised by the 6:00am read across the five systems.',
  notifyPrefix: 'Send to',
  emptyLabel: 'No work in this band for the current filter.',
  campaignRailTitle: 'Campaigns',
  sentLog: {
    title: 'Sent today',
    subtitle: 'What the office has already passed to an agent, most recent first.',
    empty: 'Nothing sent yet today.',
  },
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
      budget: noBudget('Calls against the existing database.'),
      action: 'Call the 11 warm enquirers in Box+Dice',
      detail: 'Priority order: enquired, never inspected.',
      evidence: [
        { system: 'REA Ignite', fact: '8 enquiries in the week of 20–26 Jul, from the real report' },
        { system: 'REA Ignite', fact: '0 inspection actions in the same week' },
        { system: 'Box+Dice CRM', fact: '11 enquirers have no inspection logged. Modelled.' },
      ],
      contactsSource: 'Box+Dice CRM',
      contacts: [
        { name: 'Marcus Reid', line: 'Enquired 21 Jul. Asked for a weekday inspection, never booked.' },
        { name: 'Sophie Lam', line: 'Enquired 21 Jul. Second enquiry on this campaign.' },
        { name: 'David Okonkwo', line: 'Enquired 22 Jul. Asked about the car space.' },
        { name: 'Elena Vasquez', line: 'Enquired 22 Jul. Downsizing, cash buyer, no chain.' },
        { name: 'James Turnbull', line: 'Enquired 23 Jul. Asked for the floorplan, opened it twice.' },
        { name: 'Priyanka Shah', line: 'Enquired 23 Jul. Interstate, asked about a video walkthrough.' },
        { name: 'Tom Bradley', line: 'Enquired 24 Jul. Asked about owners corporation fees.' },
        { name: 'Grace Whitfield', line: 'Enquired 24 Jul. Saved the listing, no contact since.' },
        { name: 'Andrew Pappas', line: 'Enquired 25 Jul. Buying for a tenant, asked about rental return.' },
        { name: 'Michelle Tran', line: 'Enquired 25 Jul. Asked whether the price was negotiable.' },
        { name: 'Robert Eastwood', line: 'Enquired 26 Jul. Local, asked about the north aspect.' },
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
      budget: noBudget('Replies from the inbox already in front of you.'),
      action: 'Reply to the six unanswered enquiries, oldest first',
      detail: 'Two are past four days.',
      evidence: [
        { system: 'Box+Dice CRM', fact: '6 enquiries are awaiting a first reply; the oldest has waited four days' },
        { system: 'Domain Skylight', fact: '9 enquiries this week, the strongest week of the campaign' },
      ],
      contactsSource: 'Box+Dice CRM',
      contacts: [
        { name: 'Hannah Brooks', line: 'Waiting 4 days. Asked for a private inspection this week.' },
        { name: 'Daniel Mercer', line: 'Waiting 4 days. Asked for the contract of sale.' },
        { name: 'Aisha Rahman', line: 'Waiting 2 days. Asked about the auction date.' },
        { name: 'Peter Kostas', line: 'Waiting 2 days. Asked about land size and rear access.' },
        { name: 'Laura Finch', line: 'Waiting 1 day. Asked whether the guide had moved.' },
        { name: 'Sam Whitaker', line: 'Waiting 1 day. Repeat enquirer from the first week.' },
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
      budget: noBudget('Notes against groups already through the door.'),
      action: 'Log follow-up notes for Saturday’s open for inspection',
      detail: '9 groups attended; 4 have notes.',
      evidence: [
        { system: 'Box+Dice CRM', fact: '5 of 9 Saturday groups have no follow-up note' },
        { system: 'Box+Dice CRM', fact: 'Auction is six days out, Saturday 1 August' },
      ],
      rule: 'Raised when inspection notes are still missing 48 hours after the open.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'albert-vendor-price',
      campaignId: 'albert',
      campaignAddress: '102/380 Albert Street, East Melbourne',
      assigneeId: 'ranko',
      urgency: 'today',
      urgencyLabel: 'Today',
      budget: noBudget('A conversation, not a spend. It is the one that unlocks the rest.'),
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
      budget: noBudget('Media is complete here. The guide is the lever, not spend.'),
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
      id: 'huntingtower-calldown',
      campaignId: 'huntingtower',
      campaignAddress: '12 Huntingtower Road, Armadale',
      assigneeId: 'annabel',
      urgency: 'week',
      urgencyLabel: 'This week',
      budget: noBudget('Calls against a list that already exists.'),
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
      budget: noBudget('Appraisal is prepared in-house.'),
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
      budget: noBudget('Two phone calls and a recurring reminder.'),
      action: 'Call the two finance-pending buyers',
      detail: 'Set a weekly touch until approval.',
      evidence: [
        { system: 'Box+Dice CRM', fact: 'Both buyers are waiting on approvals; last contact was eight days ago' },
        { system: 'Domain Skylight', fact: '4 enquiries this week and saves are flat across the fortnight' },
      ],
      contactsSource: 'Box+Dice CRM',
      contacts: [
        { name: 'Nadia Halabi', line: 'Approval pending 12 days. Last contact 8 days ago.' },
        { name: 'Chris Donnelly', line: 'Approval pending 9 days. Broker changed lender last week.' },
      ],
      rule: 'Raised when a warm buyer goes seven days without contact.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'albert-refresh',
      campaignId: 'albert',
      campaignAddress: '102/380 Albert Street, East Melbourne',
      assigneeId: 'ranko',
      urgency: 'week',
      urgencyLabel: 'This week',
      budget: mid(
        'Estimated $1,880',
        'Hero photograph $480 and property video $1,400. Pair it with the price conversation, not before it.',
      ),
      action: 'Price the photo and video refresh for the vendor meeting',
      detail: 'Quote both, take them to the same meeting as the price conversation.',
      evidence: [
        { system: 'REA Ignite', fact: 'Video, 3D tour and walkthrough all show zero views' },
        { system: 'REA Ignite', fact: '93 of 138 listing views last week arrived from search, where only the hero image sells' },
        { system: 'Red HQ', fact: 'No refresh product purchased in the campaign to date. Modelled.' },
      ],
      rule: 'Raised when a campaign passes the standard cycle with unused media levers.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'daly-retarget',
      campaignId: 'daly',
      campaignAddress: '216/8 Daly Street, South Yarra',
      assigneeId: 'priya',
      urgency: 'week',
      urgencyLabel: 'This week',
      budget: mid(
        'Estimated $1,370',
        'Spring hero photography $520 and viewer retargeting $850. Quote both before the vendor call.',
      ),
      action: 'Quote the spring hero refresh and the retargeting run',
      detail: 'The photo set is 96 days old and the viewer pool has never been re-touched.',
      evidence: [
        { system: 'REA Ignite', fact: '96 days on site; the current photo set has run the whole campaign' },
        { system: 'Red HQ', fact: 'No retargeting product on the record, and the video already exists. Modelled.' },
      ],
      rule: 'Raised when a campaign passes 90 days with original media and an untouched viewer pool.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'albert-3d',
      campaignId: 'albert',
      campaignAddress: '102/380 Albert Street, East Melbourne',
      assigneeId: 'ranko',
      urgency: 'week',
      urgencyLabel: 'This week',
      budget: high(
        'Estimated $3,200',
        'Only worth putting to the vendor if the price conversation lands first.',
      ),
      action: 'Put the 3D tour and walkthrough to the vendor as the second option',
      detail: 'Hold it behind the price conversation. It is the fallback, not the opener.',
      evidence: [
        { system: 'REA Ignite', fact: 'Zero engagement on 3D and walkthrough formats, because neither exists' },
        { system: 'Marshall White historical', fact: 'Apartment campaigns carrying a 3D tour averaged 1.4 times the inspection attendance. Modelled.' },
      ],
      rule: 'Raised when a campaign passes the standard cycle with a whole media format unused.',
      raised: 'Raised by the 6:00am read',
    },
    {
      id: 'daly-relaunch',
      campaignId: 'daly',
      campaignAddress: '216/8 Daly Street, South Yarra',
      assigneeId: 'priya',
      urgency: 'week',
      urgencyLabel: 'This week',
      budget: high(
        'Estimated $3,400 plus agency time',
        'Prepare the case now, put it to the vendor only if the refresh does not move reach in three weeks.',
      ),
      action: 'Prepare the spring relaunch case for the vendor',
      detail: 'New creative, new lead line, repositioned guide. Decision point is three weeks out.',
      evidence: [
        { system: 'REA Ignite', fact: '96 days on site and the listing is stale in every saved search' },
        { system: 'Marshall White historical', fact: 'A coordinated relaunch beats a slow fade on every cohort read. Modelled.' },
      ],
      rule: 'Raised when a campaign passes 90 days and the cohort read favours a reset over an extension.',
      raised: 'Raised by the 6:00am read',
    },
  ],
};

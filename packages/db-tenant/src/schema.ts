import { pgTable, serial, text, timestamp, integer, jsonb, boolean, decimal, date, time } from 'drizzle-orm/pg-core'

// Lookups / Configuration
export const typeT = pgTable('TypeT', {
  id: serial('ID').primaryKey(),
  name: text('Name').notNull(),
  description: text('Description'),
})

export const helperT = pgTable('HelperT', {
  id: serial('ID').primaryKey(),
  typeId: integer('TypeID').references(() => typeT.id).notNull(),
  name: text('Name').notNull(),
  extraFields: jsonb('ExtraFields'), // for storing name + role + email etc.
})

export const settingT = pgTable('SettingT', {
  id: serial('ID').primaryKey(),
  key: text('Key').notNull().unique(),
  value: text('Value'),
  description: text('Description'),
})

export const settingHelperT = pgTable('SettingHelperT', {
  id: serial('ID').primaryKey(),
  settingId: integer('SettingID').references(() => settingT.id).notNull(),
  name: text('Name').notNull(),
  value: text('Value'),
})

export const translationT = pgTable('TranslationT', {
  id: serial('ID').primaryKey(),
  key: text('Key').notNull(),
  value: text('Value').notNull(),
  language: text('Language').default('en'),
})

export const devTranslationT = pgTable('DevTranslationT', {
  id: serial('ID').primaryKey(),
  key: text('Key').notNull(),
  value: text('Value').notNull(),
})

export const trustedDomainT = pgTable('TrustedDomainT', {
  id: serial('ID').primaryKey(),
  domain: text('Domain').notNull(),
})

export const updateT = pgTable('UpdateT', {
  id: serial('ID').primaryKey(),
  version: text('Version').notNull(),
  description: text('Description'),
  appliedAt: timestamp('AppliedAt').defaultNow().notNull(),
})

// Core Business Tables
export const customerT = pgTable('CustomerT', {
  id: serial('ID').primaryKey(),
  name: text('Name').notNull(),
  email: text('Email'),
  phone: text('Phone'),
  address: text('Address'),
  createdAt: timestamp('CreatedAt').defaultNow().notNull(),
})

export const jobT = pgTable('JobT', {
  id: serial('ID').primaryKey(),
  customerId: integer('CustomerID').references(() => customerT.id),
  statusId: integer('StatusID').references(() => helperT.id),
  typeId: integer('TypeID').references(() => helperT.id),
  description: text('Description'),
  createdAt: timestamp('CreatedAt').defaultNow().notNull(),
  updatedAt: timestamp('UpdatedAt').defaultNow().notNull(),
})

export const activeJobT = pgTable('ActiveJobT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id).notNull(),
  // other fields as needed
})

export const jobDetailT = pgTable('JobDetailT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id).notNull(),
  description: text('Description'),
  quantity: decimal('Quantity'),
  price: decimal('Price'),
})

export const jobLableT = pgTable('JobLableT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id).notNull(),
  label: text('Label').notNull(),
})

export const statusHistoryT = pgTable('StatusHistoryT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id).notNull(),
  oldStatusId: integer('OldStatusID').references(() => helperT.id),
  newStatusId: integer('NewStatusID').references(() => helperT.id).notNull(),
  changedAt: timestamp('ChangedAt').defaultNow().notNull(),
  changedBy: text('ChangedBy'),
})

export const appointmentT = pgTable('AppointmentT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id),
  typeId: integer('TypeID').references(() => helperT.id),
  date: date('Date').notNull(),
  time: time('Time'),
  notes: text('Notes'),
  confirmed: boolean('Confirmed').default(false),
})

export const appointmentColourT = pgTable('AppointmentColourT', {
  id: serial('ID').primaryKey(),
  typeId: integer('TypeID').references(() => helperT.id).notNull(),
  colour: text('Colour').notNull(),
})

export const quoteT = pgTable('QuoteT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id).notNull(),
  total: decimal('Total'),
  status: text('Status').default('Draft'),
  createdAt: timestamp('CreatedAt').defaultNow().notNull(),
})

export const paymentT = pgTable('PaymentT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id),
  amount: decimal('Amount').notNull(),
  methodId: integer('MethodID').references(() => helperT.id),
  date: date('Date').notNull(),
})

export const expenseT = pgTable('ExpenseT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id),
  description: text('Description'),
  amount: decimal('Amount').notNull(),
  receipt: text('Receipt'), // url or path
  date: date('Date').notNull(),
})

export const maintenanceT = pgTable('MaintenanceT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id),
  issue: text('Issue').notNull(),
  resolved: boolean('Resolved').default(false),
  resolvedAt: timestamp('ResolvedAt'),
})

export const transactionImportT = pgTable('TransactionImportT', {
  id: serial('ID').primaryKey(),
  date: date('Date').notNull(),
  description: text('Description'),
  amount: decimal('Amount').notNull(),
  matchedJobId: integer('MatchedJobID').references(() => jobT.id),
  status: text('Status').default('Unmatched'), // New/Match Found/Unmatched/Completed
})

export const letterT = pgTable('LetterT', {
  id: serial('ID').primaryKey(),
  typeId: integer('TypeID').references(() => typeT.id),
  content: text('Content'),
  placeholders: jsonb('Placeholders'),
})

export const onSiteNoteT = pgTable('OnSiteNoteT', {
  id: serial('ID').primaryKey(),
  jobId: integer('JobID').references(() => jobT.id).notNull(),
  note: text('Note'),
  media: jsonb('Media'), // array of urls or paths
  createdAt: timestamp('CreatedAt').defaultNow().notNull(),
  createdBy: text('CreatedBy'),
})
import {
	boolean,
	integer,
	jsonb,
	numeric,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";

export const orderTypeEnum = pgEnum("order_type", ["pickup", "delivery"]);
export const paymentMethodEnum = pgEnum("payment_method", ["card", "cash_usd", "cash_lbp"]);
export const paymentStatusEnum = pgEnum("payment_status", [
	"pending",
	"paid",
	"failed",
	"refunded",
]);
export const orderStatusEnum = pgEnum("order_status", [
	"received",
	"cooking",
	"ready",
	"out_for_delivery",
	"delivered",
	"cancelled",
]);
export const merchOrderStatusEnum = pgEnum("merch_order_status", [
	"pending",
	"fulfilled",
	"cancelled",
]);
export const userRoleEnum = pgEnum("user_role", ["customer", "staff", "admin"]);

export const branches = pgTable(
	"branches",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		slug: text("slug").notNull(),
		name: text("name").notNull(),
		address: text("address").notNull(),
		phone: text("phone").notNull(),
		whatsapp: text("whatsapp").notNull(),
		lat: numeric("lat", { precision: 10, scale: 7 }).notNull(),
		lng: numeric("lng", { precision: 10, scale: 7 }).notNull(),
		isOpen: boolean("is_open").notNull().default(true),
		hoursJson: text("hours_json").notNull(),
		timezone: text("timezone").notNull().default("Asia/Beirut"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [uniqueIndex("branches_slug_idx").on(t.slug)],
);

export const categories = pgTable("categories", {
	id: uuid("id").defaultRandom().primaryKey(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	displayOrder: integer("display_order").notNull().default(0),
	isVisible: boolean("is_visible").notNull().default(true),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuItems = pgTable(
	"menu_items",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		categoryId: uuid("category_id")
			.notNull()
			.references(() => categories.id),
		slug: text("slug").notNull(),
		name: text("name").notNull(),
		description: text("description").notNull().default(""),
		photoUrl: text("photo_url"),
		photoBlurDataUrl: text("photo_blur_data_url"),
		basePriceUsd: numeric("base_price_usd", { precision: 10, scale: 2 }).notNull(),
		basePriceLbp: integer("base_price_lbp").notNull(),
		isVegetarian: boolean("is_vegetarian").notNull().default(false),
		isVisible: boolean("is_visible").notNull().default(true),
		displayOrder: integer("display_order").notNull().default(0),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
	},
	(t) => [uniqueIndex("menu_items_slug_idx").on(t.slug)],
);

export const modifierGroups = pgTable("modifier_groups", {
	id: uuid("id").defaultRandom().primaryKey(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	minSelect: integer("min_select").notNull().default(0),
	maxSelect: integer("max_select").notNull().default(1),
	isRequired: boolean("is_required").notNull().default(false),
	displayOrder: integer("display_order").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const modifiers = pgTable("modifiers", {
	id: uuid("id").defaultRandom().primaryKey(),
	groupId: uuid("group_id")
		.notNull()
		.references(() => modifierGroups.id),
	name: text("name").notNull(),
	extraUsd: numeric("extra_usd", { precision: 10, scale: 2 }).notNull().default("0"),
	extraLbp: integer("extra_lbp").notNull().default(0),
	isDefault: boolean("is_default").notNull().default(false),
	isVisible: boolean("is_visible").notNull().default(true),
	displayOrder: integer("display_order").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const menuItemModifierGroups = pgTable("menu_item_modifier_groups", {
	menuItemId: uuid("menu_item_id")
		.notNull()
		.references(() => menuItems.id),
	modifierGroupId: uuid("modifier_group_id")
		.notNull()
		.references(() => modifierGroups.id),
});

export const branchItemStatus = pgTable("branch_item_status", {
	branchId: uuid("branch_id")
		.notNull()
		.references(() => branches.id),
	menuItemId: uuid("menu_item_id")
		.notNull()
		.references(() => menuItems.id),
	isAvailable: boolean("is_available").notNull().default(true),
});

export const deliveryZones = pgTable("delivery_zones", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	polygonGeoJson: text("polygon_geojson"),
	feeUsd: numeric("fee_usd", { precision: 10, scale: 2 }).notNull(),
	feeLbp: integer("fee_lbp").notNull(),
	minOrderUsd: numeric("min_order_usd", { precision: 10, scale: 2 }).notNull(),
	etaMinutes: integer("eta_minutes").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orders = pgTable("orders", {
	id: uuid("id").defaultRandom().primaryKey(),
	shortId: text("short_id").notNull().unique(),
	branchId: uuid("branch_id")
		.notNull()
		.references(() => branches.id),
	customerName: text("customer_name").notNull(),
	customerPhone: text("customer_phone").notNull(),
	customerEmail: text("customer_email"),
	type: orderTypeEnum("type").notNull(),
	addressJson: text("address_json"),
	deliveryZoneId: uuid("delivery_zone_id").references(() => deliveryZones.id),
	paymentMethod: paymentMethodEnum("payment_method").notNull(),
	paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
	stripePaymentIntentId: text("stripe_payment_intent_id"),
	status: orderStatusEnum("status").notNull().default("received"),
	subtotalUsd: numeric("subtotal_usd", { precision: 10, scale: 2 }).notNull(),
	vatUsd: numeric("vat_usd", { precision: 10, scale: 2 }).notNull(),
	deliveryFeeUsd: numeric("delivery_fee_usd", { precision: 10, scale: 2 }).notNull().default("0"),
	totalUsd: numeric("total_usd", { precision: 10, scale: 2 }).notNull(),
	subtotalLbp: integer("subtotal_lbp").notNull(),
	vatLbp: integer("vat_lbp").notNull(),
	deliveryFeeLbp: integer("delivery_fee_lbp").notNull().default(0),
	totalLbp: integer("total_lbp").notNull(),
	kitchenNotes: text("kitchen_notes"),
	cancellationReason: text("cancellation_reason"),
	pickupAt: timestamp("pickup_at", { withTimezone: true }),
	deliveredAt: timestamp("delivered_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const orderItems = pgTable("order_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderId: uuid("order_id")
		.notNull()
		.references(() => orders.id),
	menuItemId: uuid("menu_item_id")
		.notNull()
		.references(() => menuItems.id),
	qty: integer("qty").notNull(),
	unitPriceUsd: numeric("unit_price_usd", { precision: 10, scale: 2 }).notNull(),
	unitPriceLbp: integer("unit_price_lbp").notNull(),
	lineTotalUsd: numeric("line_total_usd", { precision: 10, scale: 2 }).notNull(),
	lineTotalLbp: integer("line_total_lbp").notNull(),
	nameSnapshot: text("name_snapshot").notNull(),
});

export const orderItemModifiers = pgTable("order_item_modifiers", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderItemId: uuid("order_item_id")
		.notNull()
		.references(() => orderItems.id),
	modifierId: uuid("modifier_id")
		.notNull()
		.references(() => modifiers.id),
	extraUsd: numeric("extra_usd", { precision: 10, scale: 2 }).notNull(),
	extraLbp: integer("extra_lbp").notNull(),
	nameSnapshot: text("name_snapshot").notNull(),
});

export const merchProducts = pgTable("merch_products", {
	id: uuid("id").defaultRandom().primaryKey(),
	slug: text("slug").notNull().unique(),
	name: text("name").notNull(),
	description: text("description").notNull().default(""),
	photoUrls: jsonb("photo_urls").$type<string[]>().notNull().default([]),
	priceUsd: numeric("price_usd", { precision: 10, scale: 2 }).notNull(),
	priceLbp: integer("price_lbp").notNull(),
	sizes: jsonb("sizes").$type<{ label: string; stock: number }[]>().notNull().default([]),
	isVisible: boolean("is_visible").notNull().default(true),
	displayOrder: integer("display_order").notNull().default(0),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const merchOrders = pgTable("merch_orders", {
	id: uuid("id").defaultRandom().primaryKey(),
	shortId: text("short_id").notNull().unique(),
	customerName: text("customer_name").notNull(),
	email: text("email").notNull(),
	phone: text("phone").notNull(),
	addressJson: text("address_json").notNull(),
	totalUsd: numeric("total_usd", { precision: 10, scale: 2 }).notNull(),
	totalLbp: integer("total_lbp").notNull(),
	status: merchOrderStatusEnum("status").notNull().default("pending"),
	stripePaymentIntentId: text("stripe_payment_intent_id"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const merchOrderItems = pgTable("merch_order_items", {
	id: uuid("id").defaultRandom().primaryKey(),
	merchOrderId: uuid("merch_order_id")
		.notNull()
		.references(() => merchOrders.id),
	merchProductId: uuid("merch_product_id")
		.notNull()
		.references(() => merchProducts.id),
	size: text("size").notNull(),
	qty: integer("qty").notNull(),
	unitPriceUsd: numeric("unit_price_usd", { precision: 10, scale: 2 }).notNull(),
	lineTotalUsd: numeric("line_total_usd", { precision: 10, scale: 2 }).notNull(),
});

export const users = pgTable("users", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: text("email").notNull().unique(),
	phone: text("phone"),
	role: userRoleEnum("role").notNull().default("customer"),
	lastSignInAt: timestamp("last_sign_in_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const authOtp = pgTable("auth_otp", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: text("email").notNull(),
	tokenHash: text("token_hash").notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
	usedAt: timestamp("used_at", { withTimezone: true }),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const payments = pgTable("payments", {
	id: uuid("id").defaultRandom().primaryKey(),
	orderId: uuid("order_id").references(() => orders.id),
	provider: text("provider").notNull(),
	providerId: text("provider_id").notNull(),
	amountUsd: numeric("amount_usd", { precision: 10, scale: 2 }).notNull(),
	amountLbp: integer("amount_lbp").notNull(),
	status: text("status").notNull(),
	raw: jsonb("raw"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const auditLog = pgTable("audit_log", {
	id: uuid("id").defaultRandom().primaryKey(),
	actorUserId: uuid("actor_user_id").references(() => users.id),
	action: text("action").notNull(),
	targetType: text("target_type").notNull(),
	targetId: text("target_id").notNull(),
	diffJson: jsonb("diff_json"),
	createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

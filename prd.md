This is a good change because it makes the project more realistic for both a dissertation and an MVP startup. Here's a revised PRD that positions LAND OS as a **Land Marketplace + Decision Support Platform + Professional Feasibility Service**.

# PRODUCT REQUIREMENTS DOCUMENT (PRD)

# LAND OS

## Land Marketplace with Subdivision Visualization and Feasibility Analysis

Version 2.0 (Dissertation MVP)

---

# 1. Product Overview

LAND OS is a web-based platform that helps landowners evaluate, market, and sell land through either:

* Whole Land Sale (ขายยก)
* Subdivision Sale (ขายแบ่ง)

The platform combines:

1. Land Marketplace
2. Subdivision Visualization
3. Plot-Level Sales Management
4. Preliminary Feasibility Analysis
5. Professional Feasibility Service Request

Unlike traditional property portals, LAND OS allows buyers to interact with individual plots, view plot-level information, monitor availability in real time, and view realistic human-perspective images of each plot.

The platform also helps landowners determine whether selling the land as a whole parcel or subdividing it may generate higher returns before publishing the project.

---

# 2. Problem Statement

Many landowners are uncertain whether they should:

* Sell land as a whole parcel
* Subdivide the land into smaller plots

Current decision-making methods rely on:

* Spreadsheets
* Consultants
* Manual calculations
* Personal experience

These approaches are often time-consuming, inconsistent, and difficult for non-experts.

Existing property marketplaces focus on listing properties but do not provide tools for subdivision planning or financial comparison.

As a result, landowners lack accessible decision-support tools for maximizing land value.

---

# 3. Product Vision

To create a digital platform that combines:

* Property Marketplace
* Subdivision Visualization
* Plot Management
* Decision Support System (DSS)
* Professional Land Development Services

into a single platform that supports land development and sales decisions.

---

# 4. User Roles

## Buyer

Can:

* Browse listings
* Search properties
* View land details
* View subdivision layouts
* View individual plots
* View human perspective images
* Submit plot bookings
* Contact landowners

---

## Landowner

Can:

* Create listings
* Edit listings
* Run preliminary feasibility analysis
* Configure subdivision projects
* Configure plot pricing
* Manage bookings
* Manage plot status
* Request professional review
* Publish projects

---

## Administrator

Can:

* Manage users
* Manage listings
* Manage subdivision projects
* Manage bookings
* Manage service requests
* Manage plot statuses
* Monitor platform activity

---

# 5. Core Features

---

## Feature 1: Land Marketplace

Purpose:

Allow users to discover land opportunities.

Functions:

* Search listings
* Filter by province
* Filter by district
* Filter by price
* Filter by land size
* Filter by sale type

Sale Types:

* Whole Land
* Subdivision
* Both

---

## Feature 2: Land Listing Management

Purpose:

Allow landowners to create and manage listings.

Fields:

* Property Title
* Province
* District
* Subdistrict
* Land Area
* Latitude
* Longitude
* Whole Land Price
* Description
* Images
* Sale Mode

Sale Mode:

* Whole Land Only
* Subdivision Only
* Both

Actions:

* Save Draft
* Run Feasibility Analysis
* Publish Listing

---

## Feature 3: Preliminary Feasibility Analysis

Purpose:

Provide a quick estimate of whether subdivision development may be more profitable than whole land sale.

Inputs:

* Land Area
* Whole Land Sale Price
* Number of Plots
* Average Plot Price
* Estimated Road Cost
* Estimated Infrastructure Cost
* Marketing Cost

Outputs:

* Whole Land Revenue
* Subdivision Revenue
* Development Cost
* Net Profit
* ROI
* Profit Difference
* Recommended Strategy

Recommendations:

* Sell Whole Land
* Consider Subdivision
* Requires Further Review

Actions:

* Publish Listing
* Request Professional Review

---

## Feature 4: Professional Feasibility Service

Purpose:

Allow landowners to request expert assistance.

Services:

* Detailed Feasibility Study
* Subdivision Planning
* Plot Pricing Strategy
* Project Launch Consultation

Workflow:

Request Review
↓
Admin Receives Request
↓
Expert Analysis
↓
Report Generated
↓
Project Finalized
↓
Project Published

---

## Feature 5: Property Detail Page

Displays:

* Property Gallery
* Property Information
* Map
* Description

Tabs:

### Whole Land

Displays:

* Land Area
* Whole Land Price
* Inquiry Button

### Subdivision

Displays:

* Interactive Plot Map
* Plot Availability
* Plot Pricing

---

## Feature 6: Interactive Subdivision Map

Purpose:

Allow buyers to explore individual plots.

Displays:

* Plot Boundaries
* Plot Labels
* Internal Roads
* Project Entrance

Example:

P1
P2
P3
P4
P5
P6
P7
P8

Each plot is clickable.

---

## Feature 7: Plot Status System

### Available

Color:

Green

Status:

Available

Action:

Book Plot

---

### Reserved

Color:

Orange

Status:

Reserved

Trigger:

Buyer submits booking request.

---

### Sold

Color:

Red

Status:

Sold

Trigger:

Admin or Landowner confirms sale.

---

### Status Flow

Available
↓
Reserved
↓
Sold

---

## Feature 8: Plot Detail Panel

When a plot is selected:

Displays:

* Plot ID
* Area
* Width
* Depth
* Price
* Status

Actions:

* Book Plot
* Contact Seller
* View Human Perspective

---

## Feature 9: Human Perspective Visualization

Purpose:

Help buyers visualize the plot from ground level.

Available Views:

* Road View
* Looking Into Plot
* Looking Out From Plot
* Corner View

Example:

User clicks P3

System displays:

"What a person would see when standing on Plot P3 facing the road."

---

## Feature 10: Plot Booking System

Buyer selects:

Book Plot

Booking Form:

* Name
* Phone Number
* Email
* Message

Upon Submission:

* Booking recorded
* Plot status changes to Reserved
* Landowner notified
* Administrator notified

---

# 6. Pages

## Page 1: Marketplace

Browse all listings.

---

## Page 2: Create Listing

Create and manage listings.

---

## Page 3: Feasibility Analysis

Perform preliminary project evaluation.

---

## Page 4: Property Detail

View land details and sales options.

---

## Page 5: Subdivision Explorer

Interactive plot visualization.

Includes:

* Plot Status
* Plot Detail Panel
* Human Perspective Images
* Booking Functions

---

## Page 6: Professional Service Request

Submit request for expert review.

---

## Page 7: Admin Dashboard

System administration.

---

# 7. Admin Dashboard

Dashboard Metrics:

* Total Listings
* Total Buyers
* Total Bookings
* Total Service Requests
* Total Subdivision Projects

Modules:

### Listing Management

* Create
* Edit
* Delete
* Publish

### Plot Management

* Update Plot Status
* Modify Plot Prices
* Modify Plot Information

### Booking Management

* View Requests
* Approve
* Reject

### Service Management

* Review Requests
* Assign Consultant
* Update Status

### User Management

* Buyers
* Landowners
* Administrators

---

# 8. User Journey

## Landowner

Create Listing
↓
Run Feasibility Analysis
↓
Receive Recommendation
↓
Publish Directly

OR

Request Professional Review
↓
Receive Expert Advice
↓
Publish Project

---

## Buyer

Browse Marketplace
↓
View Property
↓
View Subdivision
↓
Select Plot
↓
View Human Perspective
↓
Submit Booking
↓
Plot Status Changes to Reserved

---

## Administrator

Manage Listings
↓
Manage Bookings
↓
Manage Service Requests
↓
Update Plot Status
↓
Sold Plot Turns Red

---

# 9. MVP Scope

Included:

* Marketplace
* Listing Management
* Preliminary Feasibility Analysis
* Property Detail
* Interactive Subdivision Map
* Plot Status Management
* Human Perspective Images
* Plot Booking
* Professional Review Request
* Admin Dashboard

Excluded:

* Online Payment
* GIS Integration
* AI Auto Subdivision Design
* Land Office Integration
* Digital Contracts
* Electronic Signatures
* Chat System
* Automatic Legal Verification

---

# 10. UI Requirements

Design Style:

Modern SaaS Platform

Inspiration:

* DDproperty
* Airbnb
* PropertyScout

Color Scheme:

Primary Green

Plot Status Colors:

* Green = Available
* Orange = Reserved
* Red = Sold

Requirements:

* Mobile Responsive
* Thai Language Interface
* Interactive Plot Map
* Slide-Out Plot Detail Panel
* Human Perspective Gallery
* Modern Dashboard
* Clean Card-Based Layout
* Rounded Corners
* Real Estate Focused UX

---

# 11. Key Innovation

LAND OS differentiates itself through three integrated capabilities:

1. Preliminary Feasibility Analysis for whole land versus subdivision decisions.

2. Interactive Plot-Level Marketplace with real-time status visualization.

3. Human Perspective Visualization that allows buyers to view plots from ground-level perspectives before visiting the site.



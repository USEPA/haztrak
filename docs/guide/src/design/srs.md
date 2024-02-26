# Software Requirement Specification document

## Purpose

The purpose of this document is to provide a list of requirement specifications for the Haztrak project. This document is intended to be used as a reference for the design and implementation of the Haztrak project. It takes into account policies and recommendations from the United States Environmental Protection Agency (EPA) e-Manifest program.

## Intended Audience

This project is a reference implementation for a hazardous waste tracking system. It will be useful
for both technical and non-technical persons that are scoping out work for adding the ability to track hazardous waste electronically to an existing or new hazardous waste management system.

### General

Haztrak (hereafter referred to as the "project") will meet the following specifications:

1. The project will be a web application that can be accessed via a web browser.
2. The project will be developed using modern web development technologies and best practices.
3. The project will be licensed in a way that allows it to be freely used, modified, and redistributed (for profit if desired) by others outside the United States Environmental Protection Agency (EPA).
4. The project source and supporting configs/files/data will be checked into a version control system (Git) that is publicly accessible.
5. The project will be designed to be scalable for a limited number of simultaneous users.
6. The project will be designed to be extensible to allow for additional functionality (possibly by others) to be added in the future.
7. The project will be designed to protect sensitive data such as third party API keys (e.g., RCRAInfo) and user passwords.
8. The project will be designed to be maintainable and provide a realistic working example without "cutting corners" that could not be used in secure production environments.
9. The project will document the design and implementation decisions made to ensure that others can understand the project and use it as a reference for their own projects.

### User Authentication and Authorization

- [x] The project will utilize authentication and authorization techniques to ensure that only
      authorized users can access and modify the data.
- [x] The project will use role based access control (RBAC) to ensure that users can only access
      the data that they are authorized to access.

### e-Manifest functionality

The reference implementation will allow users to complete the following actions:

1. Create and save draft electronic manifests to persistent storage

   - [x] The project will allow users save manifest to the haztrak database (with or without creating the electronic manifest in RCRAInfo/e-Manifest)
   - [x] The project should aid users while drafting a manifest in a manner that is consistent with the e-Manifest system.
   - [ ] The project will validate user input at various points during data entry to ensure that the data will be accepted by RCRAInfo/e-Manifest.
   - [ ] To ensure the accuracy and completeness of the data being collected, the

2. Edit electronic manifest and submit changes to RCRAInfo.
   - [ ] The project will allow user to edit electronic manifests in a manner that is consistent with the e-Manifest system and prevent users from making changes that are not allowed by the e-Manifest system.
3. Sign electronic manifests using the Quicker Sign functionality and EPA's Remote Signer policy.
   - [ ] If granted by the Haztrak admin, users that are not registered in RCRAInfo should be allowed to sign manifests using the Quicker Sign web service exposed by e-Manifest. For more information, see the [e-Manifest Remote Signer Policy](https://rcrapublic.epa.gov/files/14956.pdf).
4. The project will allow users to view manifest details and the status of electronic manifests in RCRAInfo.

### RCRAInfo Site Functionality

The reference implementation will allow users to complete the following actions:

1. Search for sites known to RCRAInfo
2. Save site information to the Haztrak database

### User Interface specification

1. The project will present a user interface that meets the W3C consortium's Web Accessibility Initiative (WAI) Accessibility Guidelines.
2. The project will use employ the use of a front end frameworks and libraries that are widely used and supported by the web development community to build the user interface (e.g., React, Angular, Vue.js, etc.) and avoid the use of proprietary dependencies, or open source software that is not supported.
3. The user interface will guide users while drafting and editing electronic manifests and notify the user of any errors or warnings that occur during data entry and provide guidance to the user on how to fix the error or warning.

### Instrumentation and Monitoring

- [ ] The project will be instrumented using toolkits based on open standards (e.g., open telemetry) for observability.
- [ ] The project will allow operators to specify a monitoring endpoint that will receive telemetry data from the application.

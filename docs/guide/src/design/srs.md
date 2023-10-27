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
5. The project will use Infrastructure as code (IaC) principles to allow third-parties to deploy using publicly available cloud services and tools using on the configurations provided.
6. The project will be designed to be scalable for a limited number (< 1000) of simultaneous users.
7. The project will be designed to be extensible to allow for additional functionality (possibly by others) to be added in the future.
8. The project will be designed to protect sensitive data such as third party API keys (e.g., RCRAInfo) and user passwords.
9. The project will be designed to be maintainable and provide a realistic working example without "cutting corners" that could not be used in secure production environments.
10. The project will document the design and implementation decisions made to ensure that others can understand the project and use it as a reference for their own projects.

### Admin functionality

the reference implementation will allow admins to...

1. Create and manage users.
2. Store their RCRAInfo credentials securely.
3. Manage sites the admin has access to in RCRAInfo.
4. Manage the users that have access to a site.
5. Give haztrak users the ability to use the administrator's RCRAInfo API credentials to interface with RCRAInfo/e-Manifest web services.

### User Authentication and Authorization

1. The project will utilize authentication and authorization techniques to ensure that only
   authorized users can access and modify the data.
2. The project will use role based access control (RBAC) to ensure that users can only access
   the data that they are authorized to access.

### User e-Manifest functionality

The reference implementation will allow users to complete the following actions:

1. Create and save draft electronic manifests to persistent storage
   - The project will allow users save manifest to the haztrak database (with or without creating the electronic manifest in RCRAInfo/e-Manifest)
   - The project should aid users while drafting a manifest in a manner that is consistent with the e-Manifest system.
   - The project will validate user input at various points during data entry to ensure that the data will be accepted by RCRAInfo/e-Manifest.
   - To ensure the accuracy and completeness of the data being collected, the
2. Edit electronic manifest and submit changes to RCRAInfo.
   - The project will allow user to edit electronic manifests in a manner that is consistent with the e-Manifest system and prevent users from making changes that are not allowed by the e-Manifest system.
3. Sign electronic manifests using the Quicker Sign functionality and EPA's Remote Signer policy.
   - If granted by the Haztrak admin, users that are not registered in RCRAInfo should be allowed to sign manifests using the Quicker Sign web service exposed by e-Manifest.
4. The project will allow users to view manifest details and the status of electronic manifests in RCRAInfo.

### User Interface specification

1. The project will present a user interface that meets the W3C consortium's Web Accessibility Initiative (WAI) Accessibility Guidelines.
2. The project will use employ the use of a modern front end framework that is widely used and supported by the web development community to build the user interface.
3. The user interface will guide users while drafting and editing electronic manifests and notify the user of any errors or warnings that occur during data entry and provide guidance to the user on how to fix the error or warning.

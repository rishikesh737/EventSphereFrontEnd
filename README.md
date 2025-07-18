# EventSphere 🎟️  (Note: This site will be decommissioned as backend AWS services are removed. )
### A Complete Event Management Platform on AWS  

EventSphere is a robust event management system designed to enable organizers to create events, manage attendees, issue digital tickets, and track event analytics—all powered by AWS Cloud services.

App link :  <a href="https://main.d7icjcyxhs1jd.amplifyapp.com"><img src="https://img.shields.io/badge/-EventSphere-5A77ED?style=for-the-badge&logo=forage&logoColor=white" /></a>
---

## 🌟 Overview  
EventSphere allows:  
- **Organizers** to create/manage events, track registrations, and view analytics.  
- **Attendees** to browse events, register, and download tickets.  
- QR-based **ticket validation** at event entry points.  
- **Mock payment integration** for test transactions.  

---

## 🎯 Features  

### 🔹 User & Admin Interfaces  
- **Organizers Dashboard** → Create and manage events, view registrant data.  
- **Attendees Portal** → Browse events, register, download QR-coded tickets.  

### 🔹 Authentication & User Roles  
- AWS Cognito for **signup/login** flows.  
- Role-based access (`Organizer`, `Attendee`) using Cognito Groups.  

### 🔹 Data Management (Amazon DynamoDB)  
Stores:  
- Event details  
- User registrations  
- Ticket metadata (QR code ID, status)  

### 🔹 Ticket Generation  
- PDF tickets generated by AWS Lambda on registration.  
- Embedded **QR codes** for validation at entry points.  

### 🔹 Hosting & Storage  
- Frontend hosted via **AWS Amplify** .  
- Ticket PDFs stored in **S3 with pre-signed links** for secure downloads.  

### 🔹 Payment Integration  
- **Stripe (test mode)** for simulated transactions.  

---

## 🏗️ Architecture Diagram  
![Image](https://github.com/user-attachments/assets/12990d12-11bf-4161-b4f1-7c409bac1cbc)

---

## 📦 Deliverables  
- ✅ **Admin & user portals (live-hosted)**  
- ✅ **DynamoDB schema + AWS Lambda ticketing logic**  
- ✅ **Workflow & architecture diagrams**  


---
## Project images 

![Image](https://github.com/user-attachments/assets/299f0483-ce6b-409f-a530-eb1ece48b57d)
![Image](https://github.com/user-attachments/assets/3f319a50-0e63-4db4-9bd6-646ddf94fd91)
![Image](https://github.com/user-attachments/assets/05e3e90a-4614-45b8-b043-5c7a3d70fbe2)
![Image](https://github.com/user-attachments/assets/f5a03d61-76ad-4b5f-aec4-12b3ac70946b)
![Image](https://github.com/user-attachments/assets/7d43e004-b05e-400d-b274-0f51377885a1)
![Image](https://github.com/user-attachments/assets/08ce31fa-fd76-4202-90e6-8755811a4d3d)
![Image](https://github.com/user-attachments/assets/4f4b071a-87d0-45fc-b363-6385533cdf80)
![Image](https://github.com/user-attachments/assets/d5698eb6-4e7b-42d9-b424-a0b87dfe89a8)

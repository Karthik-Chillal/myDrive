# myDrive : File Storage service

[Github](https://github.com/Karthik-Chillal/myDrive/)

myDrive is an open-source cloud storage platform with a modern user interface for seamless file storage and sharing.

### Motivation:

The goal is to learn concepts in backend: auth, database, etc to improve my understanding of how web systems work, and understand how to build services from scratch and eventually scale it to industry standard.

## Installation

Demo Live: https://mydrive-qrso264bt-karthik-chillal.vercel.app/home

> [!WARNING]
> This project is running on free version of render, so login may take upto a minute.

1. Run `git clone git@github.com:Karthik-Chillal/myDrive.git` in the terminal.
2. then `cd myDrive`
3. Use `npm install` to install the dependencies.
4. Run using `npm run dev`

## Tech Stack Used:

### Front-end:

- ReactJS + Vite
- React Router (Client side Routing)
- Axios (API client) for backend api and http requests.
- Zustand (State Management)
- Tailwindcss (Styling)
- Jest (Testing)

### Backend:

- Auth: JWT (refresh + access) & bcrypt (Password Hashing)
- Node.js + Express framework
- Postman (Testing)
- express-fileupload library for multiple file upload
- Atlas Mongoose (MongoDB ODM)

## Key Features:

#### The main features include:

- [x] Authentication & Authorization using refresh token
- [x] Folder creation & File upload
- [x] Navigate through different Folders created
- [x] Saves all files & folders in the backend server until deleted by user
- [x] Deletion & Rename operations on files and folders.
- [x] File Viewing natively in browser instead of downloading it.
- [ ] Switch to fs module & stream/buffer for handling large file size.
- [ ] Pagination.
- [ ] Fetch and display the total storage used by the user.
- [ ] Implement search feature: which will fetch the file/folder by typing the name in a searchbar.
- [ ] Add option to share files with others.
- [ ] Implement Rate Limiting & Sanitization of inputs.
- [ ] Implement Sort-by feature.
- [ ] use caching for optimisation using Redis.
- [ ] Instead of storing on a computer, use AWS.
- [ ] Websocket for live collaboration viewing/processing status/real-time comments.
- [ ] Make website responsive.

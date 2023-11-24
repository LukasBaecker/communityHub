This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Setup Instructions

### Setup Firebase 
1. Anmelden bei Firebase (kostenlos)
2. neues Projekt anlegen
  a. Name eingeben
  b. Analytics kann aber muss nicht
3. Authentication hinzufügen
  a. klick auf "Authentication" dann auf "los geht's"
  b. E-Mail/Password und dann im nächsten Schritt Schalter "aktivieren"
4. Cloud Firestore aktiviert
  a. Cloud Firestore anklicken
  b. "Datenbank erstellen" und gewünschte Einstellungen vornehmen
  c. unter "Regeln" folgenden Code einfügen und "Veröffentlichen" klicken

```txt
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read: if request.auth != null;
    }
    
    //rules for additional user information that is not saved in the auth part
    match /user/{userId} {
    			allow read: if request.auth != null;
          allow update, delete: if request.auth != null && request.auth.uid == userId;
          allow create: if request.auth != null;
          
          match /secure/{secureId}{
          allow create, read, update, delete: if request.auth != null && request.auth.uid == userId;
          }
    }
    //rules for groups 
    match /groups/{groupId} {
        function isSignedIn() {
          return request.auth != null;
        }

        function getRole(rsc) {
          return rsc.data.roles[request.auth.uid];
        }

        function isOneOfRoles(rsc, array) {
          return isSignedIn() && (getRole(rsc) in array);
        }

        function isValidNewGroup() {
          return resource == null
            			&& request.resource.data.roles[request.auth.uid] == 'owner'
           				&& 'name' in request.resource.data //check if a name exists in the request
           			 	&& 'description' in request.resource.data //check if description exists            
        }

				//for members that only can change content 
				//but not important values like the title or roles of members
        function onlyContentChanged() {
                  // Ensure that title and roles are unchanged and that no new
                  // fields are added to the document.
                  return request.resource.data.name == resource.data.name
                    && request.resource.data.roles == resource.data.roles
                    && request.resource.data.creator == resource.data.creator
                    && request.resource.data.keys() == resource.data.keys();
        }
        //checking if a person that is not member of the group is just creating a new joinrequest
        function onlyJoinRequest(){
				return request.resource.data.keys().hasOnly(['creator','name','description','roles']) 
                    && request.resource.data.name == resource.data.name
                    && request.resource.data.roles == resource.data.roles
                    && request.resource.data.creator == resource.data.creator
                    && request.resource.data.description == resource.data.description
                    && request.resource.data.keys() == resource.data.keys();
        }
				// Only an owner can create or delete a group 
				// but a member can update group content.
        allow create: if  isValidNewGroup() && isSignedIn();             
				allow read: if isSignedIn();
        allow update: if isOneOfRoles(resource, ['owner'])
                      || (isOneOfRoles(resource, ['admin']) && onlyContentChanged())
                      || onlyJoinRequest() && request.auth != null; //allow users to access the joinRequestPath
        allow delete: if isOneOfRoles(resource, ['owner']);
        
        //join requests are part of a group
        match /joinRequests/{joinId} {
          // Only owners or admins of the group or the requestor of the join-event can see the requests
          allow read: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                      ['owner', 'admin']) || request.auth.uid == joinId;                                     
          allow create:if request.auth.uid != null
          								&& joinId == request.auth.uid
              						&& request.resource.data.state == "pending";
        	allow update: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupsId)),
                                      ['owner', 'admin']) 
                        || (request.auth.uid == joinId && request.resource.data.state=="pending") 
          allow delete: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                      ['owner', 'admin']) 
                        || request.auth.uid == joinId 
        }
        //TODO: hier nochmal drübeschauen und bearbeiten, ist noch nicht final bearbeitet
         //events are part of a group
        match /calendars/{calendarId} {
          // Any role can see events.
          allow read: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                      ['owner', 'member']);                                     
          // Owners, members can create new events. The
          // user id in the event document must match the requesting
          // user's id.
          //
          // Note: we have to use get() here to retrieve the group
          // document so that we can check the user's role.
          allow create: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                        ['owner', 'member'])
                        && request.resource.data.user == request.auth.uid;

        }


        //events are part of a group
        match /events/{eventId} {
          // Any role can see events.
          allow read: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                      ['owner', 'member', 'reader']);
                                                            
          // Owners, members can create new events. The
          // user id in the event document must match the requesting
          // user's id.
          //
          // Note: we have to use get() here to retrieve the group
          // document so that we can check the user's role.
          allow create: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                        ['owner', 'member'])
                        && request.resource.data.user == request.auth.uid;

        }
                //TODO: hier nochmal drübeschauen und bearbeiten, ist noch nicht final bearbeitet
         //events are part of a group
        match /taskCategory/{taskCategoryId} {
          // Any role can see events.
          allow read: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                      ['owner', 'member']);                                     
          // Owners, members can create new events. The
          // user id in the event document must match the requesting
          // user's id.
          //
          // Note: we have to use get() here to retrieve the group
          // document so that we can check the user's role.
          allow create: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                        ['owner', 'member'])
                        && request.resource.data.user == request.auth.uid;

          //a task is a sub-selection of task-categories. One can create a new category and then tasks inside of this category
          match /tasks/{taskId} {
            // Any role can see tasks.
            allow read: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                        ['owner', 'member']);

            // Owners, members can create new tasks. The
            // user id in the task document must match the requesting
            // user's id.
            //
            // Note: we have to use get() here to retrieve the group
            // document so that we can check the user's role.
            allow create: if isOneOfRoles(get(/databases/$(database)/documents/groups/$(groupId)),
                                          ['owner', 'member'])
                          && request.resource.data.user == request.auth.uid;

          }
				}
     }
  }
}

```

5. App hinzufügen
  a. auf der Startseite des Firebase Projekts "Web" auswählen
  b. App benennen und "registrieren"
  c. die Keys unter "firebaseConfig" (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId) in die Datei "firebase/firebase-cofig.js" als "FirebaseCredentials" an den entsprechenden Platzhaltern einfügen.





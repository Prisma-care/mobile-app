## Architecture

The project is architectured like the following
- src/app contains all the code
- src/assets contains all the fonts and images
- src/shared contains all the shared files:
  - The types (previously the dto objects)
  - some utility functions and interfaces
  - the questions
- src/theme contains the sass variables

For the code part, each folder in the app folder is a module.
  - The albumList is the module that handles the list of albums
  - auth contains everything related to the authentication part of the application (all the screens before getting to the albumList screen)
    - The intro component
    - The password reset page
    - The newLoveDone screen
  - core contains all the services and the interceptors used in the app
    - All the services are decomposed, each service handles handles only its part
    - The interceptors are used to intercept every request send on received, we removed the backend service and used interceptors to add headers to each requests on the fly
  - The shared contains the shared component, for now it's only albumOrStory (those are the squares on the list on either the albumList or the storyList)
  - Sidebar contains all the components used in the bar on the left
    - Invite a person
    - Give feedback
    - Logout
  - storyList contains everything about stories
    - createOrUpdateStory is the component used to create or update a story
    - question is used for the questions
    - storyDetail is used to display the details of a story
  - The app component is the one responsible for the autoLogin

## Important points for the dev part

In order to develop/build/release the app, you'll need to modify the 'environment.ts' file in the root. Add a YouTube API key and the address of the backend. These are not included for reasons of security. Then run either `gulp develop` or `gulp production`. This will export the desired environment to `src/app/environment/environment.ts`. 

We added Prettier as a precommit hook which will, when you try to commit, prettify the code you're trying to push to have a unified code base.

We also added tslint, with the rules coming from John Papa guidelines. Tslint will, firstly indicate in your IDE if you have any errors, or you type incorrectly something. If you don't take care of these errors and you try to push buggy code to the codebase, tslint will block you on the commit and you won't be able to push unless you fix the errors

## Important changes in the codebase

Almost all the forms that were in the app are now transformed to reactive forms.

We used interceptors to handle headers on request and http errors and removed the backed service that was in place.

We removed the authGaurd that was extended by every component, since we have interceptors that will check the token on each request.

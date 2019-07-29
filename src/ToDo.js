//(2) Bug: When captcha required for login, unlimited tabs may get created
  // Fix: Send push notification

//(3) Fix: Buttons
  // Fix: Sounds, Notifications, Pushes, Modes as separate buttons outside of modules
  // Fix: Pages and Scrape Size as button group toggles

//(4) Next: Create Import Feature

//(5) Feature: Give an estimated work time and the pay for the caught HITs with known completion times -- Maybe even have those separated from the others
  // Feature: If I set up the Queue Timer part where it can select individual HITs, I can probably use that information to set
  //          up a work session where the user can go through the selected surveys as a batch, handled by the queue manager.

//(6) Add TV/TO buttons/info row to HIT Info window

//(7) Next: Add Review window for the scraper to open to show review info

//(8) Feature: Show icons on frozen or background scrapers with unseen new HITs
  // Fix: It can also be used for scrapers that aren't the default module being shown and running

//(9) Create Earnings/HIT Tracker database

//(10) Bug: Pandas when logged out
  // Fix: Panda.js can return the logged out action which brings up the modal that notifies
  // DONE 2. App.js can detect the redirect and open a window for the login
  // DONE 3. The page can send a message after login
  // DONE 4. The message that login was successful can restart the fetch functions

//(11) Feature: Make giving ratings more streamlined for mouse.
  // Fix: A responsive circular wheel can pop out when clicked. Each number corresponds with the gradient of the rating system colors
  //      Can use this wheel for a "quick actions" button for hot listing, blocking, etc.

//(12) Need to mod the style sheets

//(13) Change Buttons
  // DONE: Change Scrape toggles to be buttons with a certain color (and maybe glow) when they're active
  // DONE: Change Strict/Loose Toggles to be slider buttons
  // DONE: Change Scrape Size to be dropdown with options of 25, 50, 75, 100
  // Same with Work, Chill, Sleep Modes - Users will appreciate the better visual feedback
  // If they can look pushed in like buttons, it would be even better

//(14) Feature: Add a manager, so a certain tab will only work through a certain requester or go to the nth HIT after submitting

//(15) Feature Mod: The Personal Rating system should include a "minimum reward" or "desired reward" as a parameter for the rating
  //               I should also think about merging the rating system with the include system.
  //              -It could work with them both showing as one on the "HIT Info" window-

//(16) Feature: Alarms and colors based on percentage of time left in HIT in queue - auto turn off for batches....or just one alert for multiple HITs....or a cooldown for certain titles

//(17) Feature: Add a Turbo-then-stop feature on HITs caught, just in case a C-SATS HIT is a batch. If it catches more, it'll keep pandaing.
  //           If not, it'll stop and run the motion of the feature above.

//(18) A background of fire on the HotList Buttons as a gif would be nice as well as maybe a black 'X' over the block buttons for balance

//(19) Create HITs found in Scraper [On the fence about this] database

//(20) Feature: Make animations for the add Module window to pop up and expand to show styled buttons for catcher and scraper (Presentation is everything)
  //           A little walkthrough might be nice too

//(21) Feature: Implement a captcha counter system to prevent it from interrupting catches

//(22) Idea: If the pandas can give some kind of visual feedback when it's their turn and when there is success or blocks or anything, it might enhance the experience
  //        If I can take it a step further with characters or icons or something, it could add a level of personalization that enhances the experience too

//(23) Survey Feature: Use the Qualtrics thing to save the pages into a database or something that can be recalled and assembled later easily

//(24) Feature: A setting for people to add a certain requester to a database. When someone's scraper gets notice of it, they send a message to the server.
  //           The server sends a message to everyone who's opted in to the watcher and starts/manages their pandas.

//(25) Note: If I can have some kind of forum system integrated into the app where people can interact without having to leave the app, it would
  //        help lock people into the system just from the social aspect. The amount of data potentially able to pass through would have to be dumped
  //        quickly. It could easily cancel out the performance gains of a single application.

//(26) Note: When opening new tabs for Dashboard, Queue, etc., use chrome functions to detect other windows and add tabs separately there
  // If no other windows, open in new, separate, window
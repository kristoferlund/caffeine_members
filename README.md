# Membership Management

Created with [Caffeine](https://caffeine.ai) in ca 1 hour while waiting for a plane.

## Live app: https://members-6096.caffeine.site

## All prompts

> Create me an app that allows me to manage members for a small local association. Members register with name, surname and email address. Address validation needs to happen canister side to ensure valid addresses. Also track metadata such as created date, updated date.

---

> Great, how about giving the app a nice Windows 95 inspired theme?

---

> Nice! But a membership management app would be nothing without nice view transitions! Clicking on a member brings up a detail view. When transiting from main screen to detail screen there should be a flash and some fire sprites moving from the bottom of the screen to the top. Or a nice explosion effect, cartoon style, you choose!

---

> So.. I have an issue. I need to be able to handle many users. Can you seed a 1000 test users? And the UI needs to be adopted to handle this amount. On main screen, Only user names - first and surname - are listed. And since this is a nostalgic Win 95 style app, lets allow the user to click some arrow buttons to navigate between list views. Show only 10 users per view. 

---

> The customer came back saying that user seeding does not work. There seem to be some duplicates issue or something. Also they said.. we really need to be able to sort the user list by name asc/desc and by surname asc/desc. We want those arrows that show sort direction. Also, seeding less users is ok. Lets go with 100 users.

---

> Fail to insert users (possible duplicates). Something is off here. You need to figure out what. The addMember function returns false only. Perhaps you can return an Ok/Err response instead with some more details to help debug? But do whatever it takes to figure out what is going wrong here.

---

> Error says "invalid email address". Double check how the addresses are generated. 

---

> You need to rethink/rework the email validation! This is not good enough! For instance, this address fails: john.evans@example.com

---

> Good machine! Add 10 features you think should be included to make this membership management system more complete. Lean on proven patterns and use cases but also surprise and dazzle me!

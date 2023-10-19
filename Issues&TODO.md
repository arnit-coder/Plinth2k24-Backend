# TODO 
1. team -> getAllTeams (admin only )
2. team -> deleteTeam (team Leader  only )
3. team -> getMyTeam (team members only )


4. competition -> updateCompetition 

5. ~~update the googleauth to store the cookies in correct place~~

6. ~~Store competition name in the team schema~~


# Queries 
1. should one person be only in one team ? -> no two teams in same competition but in differnet competitions it can be possible 

2. do we have to create a log file somewhere where we should store the errors and queries and the deleted teams/competions etc for refrecence . 


# ISSUES 
1. Don't send otp to frontend in the response of auth/sendotp (the person can enter the otp without having to check the mail and can enter using wrong mail also cuz he is getting the otp in the broswer )

2. auth/sendotp route is giving response as 200 even if the mail is not sent  (it should give 400)

3. ~~for the team Schema the members is an array of object so checking every array for every team for each user will be computationally expensive . So we can add an array of team codes in the user schema to simplify the process~~

4. 
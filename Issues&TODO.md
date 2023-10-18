# TODO 
1. team -> getAllTeams (admin only )
2. team -> deleteTeam (team Leader  only )
3. team -> getMyTeam (team members only )


4. competition -> updateCompetition 

5. ~~update the googleauth to store the cookies in correct place~~



# Queries 
1. should one person be only in one team ? 

2. 


# ISSUES 
1. Don't send otp to frontend in the response of auth/sendotp (the person can enter the otp without having to check the mail and can enter using wrong mail also cuz he is getting the otp in the broswer )

2. auth/sendotp route is giving response as 200 even if the mail is not sent  (it should give 400)

3. 

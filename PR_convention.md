PR should be started from branches, not from forks.

Try to do small pr if possible. Do pr often, to keep them consize and clear :) Do not try to do the whole project in one pr inside your branch haha.

Also, try to commit files that have been linted. :) I recommend to start using prettier. The base config of prettier is a good start, if needed, we will see later what config change we may choose.

Retrieve the main branches changes in your branche whenever possible before the pr, or during the pr, if there is some update during the time your pr is opened.

### Title
For a single commit, the title is the subject line of the commit message.
Otherwise, the title should summarise the set of commits.
You can add keyword like in commits for clarity, see conventional_commit.md for more.

If the PR is still not ready to merge for whatever reasons, set "WIP :" a the begining of the title.

### Description
Explain any context related to the content of the PR : Why did you start working on this feature ?

Is it to fulfill the specifications of the project ? Or to improve development in any way ? Or to fix an issue ? (You can mention the issues in the pr with a dash, and the issue number, for example : \#1.)

If it's partial work, specify it as well. It does not mean that you should do a PR for non working partial feature, but for working partial feature, you can.

For example : "Authentification fully working, from the backend." suppose that nothing is done for the front.

Please, if necessary, you can add some information about the use of said feature.

You can directly add documentation in the project folder, but leave a quick heads up, and where to look at for more, directly in the PR description.

Don't forget to mention any pr that may be related to this one. And explain how they are related.

If this pr add tests to the projects, specify how to treats them. Do we need to run them ? Do they run by themselves ? By default we will consider that it doesn't add testing.

In our case, the most likely, is that we can expect to get some mockup routes in backend_mockup.

### Assigned
If a person is assigned to the PR, let that person merge the pr after the reviewing, if not, the second reviewer can merge if everything is good

### Reviewers
Once the PR is ready to be merged, not in "WIP", you can add reviewers to the pr. If you can, add at least one profane, and one person working on similar subject. There need to be at least two succesful review to merge one pr.

You can add more reviewers if you like

For the reviewers themselves : Please read carefully the pr, and don't hesitate to communicate about the content of the pr, for any clarification needed.

You can also do positives comments if you see something you like. A nice word can mean a lot in a long day of work :)

No questions are stupids :) 

If you see some fix that you can achieve yourself, please, create a sub branch, commit your change there, and offer the updates you did from this branch, to the branch you were reviewing. So that the person who was working on this can discuss the change or accept them in the best conditions.

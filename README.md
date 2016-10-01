# As Yet untitled Canadian Election Reform website


### Purpose:

To create a website which allows people to easily visualize and understand the differences in the various electoral systems proposed to replace Canada's First Past the Post system.

### Specifications:

* Landing Page
  * The landing page should have the following:
    * Navigation
    * A language selector (English/French)
    * "Was Your Vote Wasted?"
      * As a user, I want a very brief explanation of vote wastage, with a link to more detail.
      * As a user, I want to see how many votes in Canada were statistically Wasted
      * As a user, I want to drill down to my province to see how many votes were wasted in the province.
      * As a user, I want to drill down to my district to see how many votes were wasted in the district.
      * As a user, I want to enter in who I voted for and find out if my *personal* vote was wasted.  
        * If my vote was wasted, it should show "My vote was wasted".
        * If I cast a vote for a candidate that won, it should show "There is an X% chance your vote was wasted. (or, put another way, you effectively cast 100-% of a statistically significant vote)"
    * "What would Parliament look like?
      * It should have a disclaimer at the bottom that these results are projected from the 2015 election results and provide a link to more information (possibly a modal).
      * The page should be divided into three sections:
      * The first section should be a graph of Parliament's seats by party,
        * It should be labeled "First Past the Post"
        * It should display who would likely form the government, and what type (Liberal Majority Government, Conservative Minority Government, Liberal-NDP coalition, etc.)
      * The third section should be a graph of Parliament's seats by party,
        * It should be labeled "Mixed Member Proportional\* (\*estimated)"
        * A slider should appear under MMP with values from 0% to 10%, controlling the threshhold to be used to calculate the result.
          * It should be labeled: "Minimum popular vote percentage needed to be seated"
      * The middle section should be a set of sliders, corresponding to each political party. Each slider is set to the percentage of popular votes each party got.  
        * They should start at the real 2015 election results.
        * There should be a reset button for the real 2015 election results.
        * The sliders should be:
          * Conservative Party (0-100% - label should be the raw number of votes and the +/-% from the real results. )
          * Liberal Party (0-100%)
          * New Democratic Party (0-100%)
          * Bloc Quebecois  (0-100%)
            * A warning should appear if Bloc Quebecois is given more than 24% of the vote (as Bloc only ran in Quebec, which cast 24% of the total vote. )
          * Green Party (0-100%)
          * Minor parties and Independents.  (0-100%)
        * When each eadjusted.slider moves
          * the other sliders are reduced(proportionally) or increased(proportionally) to adjust for the gain or loss, so that all votes add up to 100%.  
          * The MMP votes are recalculated and the MMP graph is re-rendered.
          * Each *individual district* in the FPP graph is adjusted and the makeup of Parliament is recalculated, and the graph re-rendered.
    * "MMP vs. FFP in theory and practice":
      * The third and final section should explain the differences between FPP and MMP point-by-point.  It should be made clear that certain things are *facts*, and other things are advantages and disadvantages *in theory.*  
        * For Example:
          * It is a FACT that MMP produces a parlaiment where each party gets a number of seats proportional to the number of votes they got.
          * It is THEORY that MMP forces parties to hold their own more accountable.
     * More information & Footer:
       * About us information
       * Contact us
       * Any disclaimers
       * links to more information ("Elections Canada", "FairVote.CA")

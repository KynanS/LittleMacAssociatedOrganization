The way the data works in `LMSL_Matches.csv` is that each row is a match that was played in the tournament. Each match will have 2 players taht played in it. One of them will win and one will lose. Each match contains all information related to what tournament it happened in, when, and all relevant information related to the players.

The fields for each match describe the data for each match as follows:

`LMSL`: Describes which edition of the tournament the match took place during. There have been 12 editions. The format of the field is an integer.

`Group`: This is the label for what group a match took place in. All matches in group stage 1 happen in a group labeled A through H, meaning there are 8 different groups. Group stage 2 contains the matches for groups A through D, meaning there are 4 different groups. Each group will have 4 players in them. All matches in the playoffs will have one of the labels `R01` representing the Quarter Finals, `R02` representing the semi finals, `R03` representing the Finals, and `3rd Place Match` which represents the third place match.

`Group Stage`: Contains the specific stage of the tournament the matches are taking place in. The possible values are `GS1` representing Group Stage 1, `GS2` representing Group Stage 2, or `playoffs` representing the playoffs.

`Match Number`: This represents the order of games within a specific group. When `Group Stage` says either `GS1` or `GS2`, the value of `Match Number` has specific meanings. If it is `1` or `2` then it is an Opening Match, if it is `3` then it is a Winners Match, if it is a `4` then it is a Losers Match, and if it is a `5` it is a Deciders Match. If the `Group Stage` says `playoffs`, then the number value of `Match Number` is just the order of the specific playoff round.

`Winner`: A number that represents which player won the match. The number will match the `Player ID` of the player that won. Either `Player 1 ID` or `Player 2 ID`.

`Walkover`: Indicates whether a game was played or a walkover was given. If it was a walkover the field will contain `ff`, otherwise it will be blank. If the match was a walkover, `Player 1 Score` and `Player 2 Score` will equal `-1`, and then the only way to know who won the game will be by checking the `Winner` field.

`Best Of`: The maximum number of games that can be played in the match.

`Player 1 ID`: An integer that indicates this player is Player 1. If this player won the match, this field will match `Winner`.

`Player 1 Name`: The name of Player 1.

`Player 1 Score`: The number of games Player 1 won in this match. If the value is `-1`, then the match was a walkover.

`Player 1 Flag`: The country Player 1 is from.

`Player 1 Race`: The race Player 1 played in this match.

`Player 2 ID`: An integer that indicates this player is Player 2. If this player won the match, this field will match `Winner`.

`Player 2 Name`: The name of Player 2.

`Player 2 Score`: The number of games Player 2 won in this match. If the value is `-1`, then the match was a walkover.

`Player 2 Flag`: The country Player 2 is from.

`Player 2 Race`: The race Player 2 played in this match.

All other fields currently can be ignored.
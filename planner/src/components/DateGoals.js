// returns activeData data for single given date
//
//  db data in: [{
  // id: 'f348abf8-6a35-4f4f-a275-bf4aab188f1d', 
  // goals: [{
  //   completed: null
  //   goal_id: "27e6f92f-23bb-49e0-87ec-796568eaef0e"
  //   title: "exercise"}, ...]
  // }, ... ] 
//
//-------------------------------------------------------------

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';
import { Fragment } from "react";

export default function DateGoals({activeData}) {

  return (
    <Box> 
      { activeData?.goals ? (
        <div>
          {activeData.goals.map((goalPG) => {       
            return (
              <Fragment  key={goalPG.id}>
                {goalPG.goals.map((goal) => {
                  return <Tag key={goal.goal_id} variant='solid' colorScheme={goal.completed === null ? 'red' : 'blue' }>
                    {goal.title}
                  </Tag> 
                })}
              </Fragment>
            ) 
          })}
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </Box>
  );
};
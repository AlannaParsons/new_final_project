// returns rank data for single given date
//
//  db data in: [{
  // color: "purple"
  // completed: "2024-12-12T07:00:00.000Z"
  // fk_status: "e5da41ee-2b4d-4ba8-8475-fa42fd97fa8d"
  // id: "6a54003e-8260-4245-b073-221ca81f6c66"
  // phrase:  "meh"
  // rank_id: 10
  // title: "mood"
//}
//-------------------------------------------------------------

import {
  Box,
  Spinner,
  Tag
} from '@chakra-ui/react';
import React from "react";

export default function DateRank({activeData}) {
  let placeholder = 'not ranked'

  return (
    <Box> 
      { activeData?.ranks ? (
        <div>
          {activeData.ranks.map((rankPG) => {         
            return (
              <Tag key={rankPG.id} variant='solid' colorScheme={rankPG.completed === null ? 'red' : rankPG.color }>
                { rankPG.title } 
                {' : '}
                { rankPG.phrase ? rankPG.phrase : placeholder}
              </Tag> 
            ) 
          })}
        </div>
      ) : (
        <Spinner></Spinner>
      )}
    </Box>
  );
};
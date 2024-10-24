//access current date, change current date to edit old content? 
// width of calendar pop up change
// can change editing date locally, should not change edit date for other pages
// what menu items are necessary>?
//use calendar libraby elsewhere???

import {
  Button,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { ChevronDownIcon, SettingsIcon } from '@chakra-ui/icons';
//https://www.npmjs.com/package/react-calendar
import Calendar from 'react-calendar'

export const SubHeader = (props) => {

  return ( 
    <Flex basis={'100%'} padding={'10px'} bgColor={"grey"} justifyContent={"space-between"}>
      <HStack>
        <Menu> 
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {props.activeDate.toDateString()}
          </MenuButton>
          <MenuList>
            <MenuItem ><Calendar onChange={props.setActiveDate} value={props.activeDate}/></MenuItem>
          </MenuList>
        </Menu>
        
      </HStack>

    </Flex>
  )

}
//set up to use ranking page
// purely aggrigate no active edits??
// 365 grid. drop down adds? best day of week on avg? best month?

"use client"

import Image from "next/image";
import styles from "../page.module.css";
import { daysInMonthCalc, firstDayOfMonth } from "../../utils/dateUtils";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  SimpleGrid,
  Spacer,
  Center,
  HStack,
  VStack
} from '@chakra-ui/react';
import { CheckIcon, CloseIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { colorLegend } from '../../utils/mockData.js';
import { SubHeader } from '../../components/SubHeader'
import React, { useState, useRef } from "react";
import getRandomColor from '../../utils/funcs.js/index.js';
import Month from "react-calendar/dist/cjs/YearView/Month";


export default function Goals() {

  const { onOpen, onClose, isOpen } = useDisclosure()

  //const [savedData, setData] = useState(Array(daysInMonth).fill({ color: null }));

  const makeData = () => {
    let data = []
    for (let i=0; i<12; i++){
      let daysInMonth = daysInMonthCalc("2024", i+1)
      data[i] = []
      for (let x=0; x<31; x++) {
        let hold = getRandomColor()
        data[i][x]  = hold;
      }

      //do something else. set same as background? also not account for feb
      if (daysInMonth === 30) {

        data[i][30] = null;
      } 
      
      console.log('data',data)
    }
    return data

  }
  //data structure????
  let data = makeData()
  //set local dtatee, currently faux data
  const [editInput, setEdit] = useState({'title':'', 'index': null});
  //const [activeDate, setActiveDate] = useState(date);
  //consider how i can structure from db, i like this best, but possible? 1 array 'easier'

  const month = (array,i) => {
    return <SimpleGrid key={`${i}`}>
      {array.map((item, x) => {
        

        return <Box key={`${x}, ${item}`} backgroundColor={item}  > {x+1}</Box>

      })}

    </SimpleGrid>

  }


  return (
    <div className={styles.page}>
      <main className={styles.main}>

        LEGEND {firstDayOfMonth}
        <SimpleGrid columns={12} gap='1'>
            {data.map((array, i) => {

              return month(array, i)

            })}
        </SimpleGrid>

     

        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className={styles.logo}
              src="https://nextjs.org/icons/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondary}
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

//user can rate each day in month according to personalized legend
//can be used for mood or weather rating etc....
"use client"

import Image from "next/image";
import styles from "../page.module.css";
import { daysInMonth, date, firstDayOfMonth } from "../utils/dateUtils"
import { Button, SimpleGrid } from '@chakra-ui/react'
import React, { useState } from "react";

export default function Home() {
//sets up faux saved data!!
  const colorLegend = ['pink', 'red', 'yellow', 'green','blue', 'purple']
  const [color, setColor] = useState(colorLegend[0]);
  const [savedData, setData] = useState(Array(daysInMonth).fill({ color: null }));

  const colorLock = (color) => {
    setColor(color);
  };
  const colorPut = (index) => {
    let helper = [...savedData]
    helper[index] = {...helper[index], color: color};
    setData(helper);
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>

        LEGEND {firstDayOfMonth}
        <SimpleGrid columns={7} spacing={1}>
            {colorLegend.map(color => {
              return <Button key={color} colorScheme={color} height='10px' onClick={() => colorLock(color)} ></Button>

            })}
        </SimpleGrid>

        
        <SimpleGrid columns={7} spacing={1}>
          {[...Array(firstDayOfMonth)].map(function(object, i){
            return <Button key={i} height='20px'/> ;
          })}

          {savedData.map((date, i) => {
            return <Button key={date} height='20px' colorScheme={date.color || 'gray'} onClick={() => colorPut(i) } >{i+1}</Button>

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

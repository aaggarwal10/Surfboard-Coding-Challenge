import { ReactNode, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Image,
  Center,
  Grid,
  GridItem,
  VStack
} from '@chakra-ui/react';
import { collection, setDoc, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { HamburgerIcon, CloseIcon, PhoneIcon, ChevronLeftIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import MeetingItem from '../components/MeetingItem';
import AddEditMeetingTopic from '../components/Modals/AddEditMeetingTopic';
import { ViewTopicMode, MeetingTopic } from '../lib/types';
import db from "../services/firebase";
import MakeZoomCall from '../services/zoom';
const Links = ['All', 'Upcoming', 'Completed', 'In Progress'];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);
export default function withAction() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const today = new Date();
  const [curMonthIdx, setMonth] = useState(today.getMonth());
  const [curYear, setYear] = useState(today.getFullYear());
  const [curDisplay, setDisplay] = useState<ViewTopicMode>(ViewTopicMode.ALL);
  const [MeetingTopics, setMeetingTopics] = useState<MeetingTopic[]>([]);
  const [DisplayTopics, setDisplayTopics] = useState<MeetingTopic[]>([]);
  
  async function getAndUpdateTopics()
  {
    const citiesCol = collection(db, 'meetingTopics');
    const citySnapshot = await getDocs(citiesCol);
    const updatedMeetingTopics = citySnapshot.docs.map((doc)=>{
      const values = doc.data();
      values.id = doc.id;
      return values;
    });
    setMeetingTopics(updatedMeetingTopics as MeetingTopic[]);
  }

  function updateDisplayTopics(displayType: ViewTopicMode) {
    let displayTopics = [];
    if (displayType == ViewTopicMode.ALL) {
      for (let key in MeetingTopics) {
        const item = MeetingTopics[key];
        const meetingDate = new Date(item.startTime);
        if (meetingDate.getFullYear() === curYear && meetingDate.getMonth() === curMonthIdx)
        displayTopics.push(item);
      }
      setDisplayTopics(displayTopics);
      return;
    }
    for (let key in MeetingTopics) {
      const item = MeetingTopics[key];
      const meetingDate = new Date(item.startTime);
      if (meetingDate.getFullYear() !== curYear || meetingDate.getMonth() !== curMonthIdx)
        continue;
      if (item.endTime < today.getTime() && displayType == ViewTopicMode.COMPLETED) {
        displayTopics.push(item);
      }
      else if (item.startTime > today.getTime() && displayType == ViewTopicMode.UPCOMING) {
        displayTopics.push(item);
      }
      else if (item.startTime < today.getTime() && today.getTime() < item.endTime && displayType == ViewTopicMode.IN_PROGRESS) {
        displayTopics.push(item);
      }
    }
    setDisplayTopics(displayTopics);
  }
  useEffect(() => {
    getAndUpdateTopics();
  }, [curDisplay, curYear, curMonthIdx]);
  useEffect(() => {
    updateDisplayTopics(curDisplay);
  }, [MeetingTopics])

  async function DeleteTopic(id: string) {
    console.log(id);  
    await deleteDoc(doc(db, 'meetingTopics', id));
    getAndUpdateTopics();
  }
  async function AddEditTopic(newItem: MeetingTopic) {
    console.log(newItem);
    newItem.zoomLink = await MakeZoomCall(newItem.topicTitle, newItem.startTime, newItem.endTime);
    const newNode = {topicTitle: newItem.topicTitle, topicDescription: newItem.topicDescription, startTime: newItem.startTime, endTime: newItem.endTime, zoomLink: newItem.zoomLink};
    const docRef = await setDoc(doc(db, 'meetingTopics', newItem.id === "" ? doc(collection(db, 'meetingTopics')).id : newItem.id), newNode);
    getAndUpdateTopics();
  }
  
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <Button onClick={() => {
                  if (link === "All") {
                    setDisplay(ViewTopicMode.ALL);
                  } else if (link === "Completed") {
                    setDisplay(ViewTopicMode.COMPLETED);
                  } else if (link === "In Progress") {
                    setDisplay(ViewTopicMode.IN_PROGRESS);
                  } else {
                    setDisplay(ViewTopicMode.UPCOMING);
                  }
                }}>
                  <NavLink key={link}>{link}</NavLink>
                </Button>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            <AddEditMeetingTopic meetingInformation={{ topicTitle: '', topicDescription: '', startTime: 0, endTime: 0, id: "", zoomLink: "" }} onSave={AddEditTopic}>
              <Button
                variant={'solid'}
                colorScheme={'teal'}
                size={'sm'}
                mr={4}
                leftIcon={<AddIcon />}>
                Add Topic
              </Button>
            </AddEditMeetingTopic>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>

      <Center my={4}>
        <HStack>
          <IconButton
            icon={<ChevronLeftIcon w={8} h={8} />}
            height="30px"
            size="md"
            variant="ghost"
            aria-label="previous month"
            onClick={() => {
              if (curMonthIdx == 0) {
                setMonth(11);
                setYear(curYear - 1);
              }
              else {
                setMonth(curMonthIdx - 1);
              }
            }}
          />
          <Text fontSize='2xl'> {months[curMonthIdx]} {curYear} </Text>
          <IconButton
            icon={<ChevronRightIcon w={8} h={8} />}
            height="30px"
            size="md"
            variant="ghost"
            aria-label="next month"
            onClick={() => {
              if (curMonthIdx == 11) {
                setMonth(0);
                setYear(curYear + 1);
              }
              else {
                setMonth(curMonthIdx + 1);
              }
            }}
          />
        </HStack>
      </Center>
      <VStack mx={300} templateColumns='repeat(1, 1fr)' gap={2}>
        {DisplayTopics.map(col =>
          <MeetingItem topicTitle={col.topicTitle} topicDescription={col.topicDescription} startTime={col.startTime} endTime={col.endTime} id={col.id} zoomLink={col.zoomLink} onDelete={DeleteTopic} onEdit={AddEditTopic} />
        )}
      </VStack>
    </>
  );
}
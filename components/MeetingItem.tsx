import { Text, GridItem, Flex, Center, Box, Spacer, HStack, IconButton } from '@chakra-ui/react'; // Chakra UI
import { MeetingTopic } from '../lib/types';
import { EditIcon, DeleteIcon, CheckCircleIcon, TimeIcon } from '@chakra-ui/icons';
import ViewTopicModal from './Modals/ViewTopicModal';
import AddEditMeetingTopic from './Modals/AddEditMeetingTopic';
type MeetingTimeProps = {
    startTime: number,
    endTime: number,
}

type MeetingItemProps = MeetingTopic & {
    onDelete: (id: string) => void,
    onEdit: (topic: MeetingTopic) => void,
};

const StringFormat = (str: string, ...args: string[]) =>
    str.replace(/{(\d+)}/g, (match, index) => args[index] || '')

function formatDateString(props: MeetingTimeProps) {
    const { startTime, endTime } = props;
    const date = new Date(startTime);
    const endDate = new Date(endTime);
    return StringFormat("{0} {1}, {2} - {3}",
        date.getDate().toString(),
        date.toLocaleString('en-us', { month: 'short' }),
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    );
}
/**
 * Custom Card component with styling.
 * @param props - Props
 * @returns custom Card.
 */
export default function MeetingItem(props: MeetingItemProps) {
    const { topicTitle, topicDescription, startTime, endTime, id, zoomLink, onDelete, onEdit } = props;
    const meetingTime = { startTime, endTime };
    const today = new Date();
    let bgCol = "white";
    if (today.getTime() > meetingTime.endTime) {
        bgCol = "green.100";
    }
    else if (today.getTime() > meetingTime.startTime) {
        bgCol = "blue.100";
    }

    return (
        <GridItem
            w="100%"
            flexDirection="row"
            background={bgCol}
            border="1px solid"
            borderColor="border.secondary"
            boxSizing="border-box"
            borderRadius="8px"
        >
            <Flex>
                <Box w='300px'>
                    <Center>
                        <Text> {formatDateString(meetingTime)} </Text>
                    </Center>
                </Box>
                <Spacer />
                <Box w='300px'>
                    <Center>
                        <ViewTopicModal topicInformation={{ topicTitle, topicDescription, startTime, endTime, id, zoomLink }}>
                            <Text fontWeight={"extrabold"}> {topicTitle} </Text>
                        </ViewTopicModal>
                        {bgCol === "green.100" &&
                            (<CheckCircleIcon ml={1} w={3} h={3} color='green.500' />)
                        }
                        {bgCol === "blue.100" &&
                            (<TimeIcon ml={1} w={3} h={3} color='blue.800' />)
                        }
                    </Center>
                </Box>
                <Spacer />
                <HStack justifyContent={"right"} w='180px' mr={2}>
                    <AddEditMeetingTopic meetingInformation={props} onSave={onEdit}>
                        <EditIcon mb={1} w={5} h={5} />
                    </AddEditMeetingTopic>
                    <IconButton
                        icon={<DeleteIcon w={5} h={5} />}
                        height="30px"
                        size="md"
                        variant="ghost"
                        aria-label="previous month"
                        onClick={() => onDelete(id)}
                    />
                </HStack>
            </Flex>
        </GridItem>
    );
}

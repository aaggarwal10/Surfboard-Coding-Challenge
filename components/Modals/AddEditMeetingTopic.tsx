import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    FormControl,
    FormLabel,
    Input,
    useDisclosure,
    Text,
    Stack,
    FormHelperText,
    Box,
    Select,
    Divider,
} from '@chakra-ui/react'; // Chakra UI
import { useState, ReactNode } from 'react'; // React
import { MeetingTopic } from '../../lib/types';

type AddEditMeetingTopicProps = {
    meetingInformation: MeetingTopic;
    children: ReactNode;
    readonly onSave: (applicationData: MeetingTopic) => void;
};
const formatDate = (date: Date, dateInput = false): string => {
    return dateInput
        ? new Date(date).toISOString().substring(0, 10)
        : new Date(date).toLocaleDateString('en-US', { timeZone: 'UTC' });
};
export default function AddEditMeetingModal({
    meetingInformation,
    children,
    onSave,
    // onSave,
}: AddEditMeetingTopicProps) {
    const { isOpen, onClose, onOpen } = useDisclosure();
    let isAdding = false;
    if (meetingInformation.topicDescription === '') {
        isAdding = true;
    }
    // Personal information state
    const [newMeetingInfo, setMeetingInfo] = useState<MeetingTopic>(meetingInformation);
    const [meetingDate, setMeetingDate] = useState(formatDate(isAdding ? new Date() : new Date(meetingInformation.startTime), true));
    const [meetingStartTime, setMeetingStartTime] = useState(formatDate(isAdding ? new Date() : new Date(meetingInformation.startTime), true));
    const [meetingEndTime, setMeetingEndTime] = useState(formatDate(isAdding ? new Date() : new Date(meetingInformation.endTime), true));
    

    function updateMeetingTimes()
    {
        const startTime = Date.parse(meetingDate + " " + meetingStartTime + ":00");
        const endTime = Date.parse(meetingDate + " " + meetingEndTime + ":00");
        onClose();
        onSave({...newMeetingInfo, startTime, endTime});
    }

    return (
        <>
            <Box onClick={onOpen}>{children}</Box>

            <Modal onClose={onClose} isOpen={isOpen} scrollBehavior="inside" size="3xl">
                <ModalOverlay />
                <form onSubmit={(e) => {
                    e.preventDefault();
                    updateMeetingTimes();
                }}>
                    <ModalContent paddingX="36px">
                        <ModalHeader
                            textStyle="display-medium-bold"
                            paddingBottom="12px"
                            paddingTop="24px"
                            paddingX="4px"
                        >
                            <Text as="h2" textStyle="display-medium-bold">
                                {isAdding ? "Adding Meeting Topic" : "Editing Meeting Topic"}
                            </Text>
                        </ModalHeader>
                        <ModalBody paddingY="20px" paddingX="4px">
                            {/* Meeting Information */}
                            <Box paddingBottom="32px">
                                <Stack direction="column" spacing="15px" paddingBottom="24px">
                                    <FormControl isRequired>
                                        <FormLabel>{'Meeting Topic'}</FormLabel>
                                        <Input value={newMeetingInfo.topicTitle} onChange={event => setMeetingInfo({ ...newMeetingInfo, topicTitle: event.target.value })} />
                                    </FormControl>

                                    <FormControl isRequired>
                                        <FormLabel>{'Meeting Description'}</FormLabel>
                                        <Input
                                            value={newMeetingInfo.topicDescription}
                                            onChange={event => setMeetingInfo({ ...newMeetingInfo, topicDescription: event.target.value })}
                                        />
                                    </FormControl>

                                    <Stack direction="row" spacing="20px">
                                        <FormControl isRequired>
                                            <FormLabel>{`Meeting Date`}</FormLabel>
                                            <Input
                                                type="date"
                                                value={meetingDate}
                                                onChange={event => setMeetingDate(event.target.value)}
                                            />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>{`Start Time`}</FormLabel>
                                            <Input
                                                type="time"
                                                value={meetingStartTime}
                                                onChange={event => setMeetingStartTime(event.target.value)}
                                            />
                                        </FormControl>

                                        <FormControl isRequired>
                                            <FormLabel>{`End Time`}</FormLabel>
                                            <Input
                                                type="time"
                                                value={meetingEndTime}
                                                onChange={event => setMeetingEndTime(event.target.value)}
                                            />
                                        </FormControl>
                                    </Stack>
                                </Stack>
                            </Box>
                        </ModalBody>
                        <ModalFooter paddingBottom="24px" paddingX="4px">
                            <Button colorScheme="teal" variant="outline" onClick={onClose}>
                                {'Cancel'}
                            </Button>
                            <Button colorScheme="teal" variant="solid" type="submit" ml={'12px'}>
                                {isAdding ? 'Add Meeting' : 'Save Meeting'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </>
    );
}

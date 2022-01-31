import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Text,
    Box,
    useDisclosure,
  } from '@chakra-ui/react'; // Chakra UI
  import { ReactNode } from 'react'; // React JSX Type
  import { MeetingTopic } from '../../lib/types';
  import Link from 'next/link';
  type ViewMeetingTopicProps = {
    readonly children: ReactNode;
    readonly topicInformation: MeetingTopic;
  };
  /**
   * Modal for Back To Search Button Going Back to Requests
   * @param children ReactNode children elements in component
   */
  export default function ViewMeetingTopic({ children, topicInformation }: ViewMeetingTopicProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
  
    return (
      <>
        <Box onClick={onOpen}>{children}</Box>
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{topicInformation.topicTitle}</ModalHeader>
            <ModalBody>
              <Text textStyle="body-regular" paddingBottom="39px">
                {topicInformation.topicDescription}
              </Text>
            </ModalBody>
  
            <ModalFooter>
              <Button
                colorscheme="teal"
                variant="outline"
                onClick={onClose}
              >
                <Text textStyle="button-semibold">Close</Text>
              </Button>
              <a href={topicInformation.zoomLink} target="_blank">
                <Button
                  colorScheme="teal"
                  onClick={() => {
                    onClose();
                  }}
                >
                  <Text textStyle="button-semibold">Join Meeting</Text>
                </Button>
              </a>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }
  
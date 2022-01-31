export type MeetingTopic = 
{
    _typename?: 'MeetingTopic';
    topicTitle: string,
    topicDescription: string,
    startTime: number,
    endTime: number,
    id: string;
    zoomLink: "",
}

export enum ViewTopicMode {
    ALL = 0,
    COMPLETED,
    IN_PROGRESS,
    UPCOMING
}
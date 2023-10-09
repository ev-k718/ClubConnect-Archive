//@ts-nocheck
import {
    Card,
    NumberInput,
    Group,
    ActionIcon,
    CheckIcon,
    Button
} from "@mantine/core";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import axios from "axios";
import { showNotification } from '@mantine/notifications';
import { IconCheck, IconAlertTriangle } from "@tabler/icons-react";



type Props = {
    applicationSubmissionId: string;
    criteriaName: string;
    score: number;
    scoringId: string;
    scoringCriteriaId: string;
    applicationId: string;
    initialized: boolean; //whether or not the score object is in the db
}


const ScoreInputCard = (props: Props) => {
    const [score, setScore] = useState<number | undefined>(props.score);
    const {getAccessToken} = useAuth();
    const { data: token } = getAccessToken();
    const queryClient = useQueryClient();

    const changeScore = useMutation({
        mutationFn: async () => {
          await axios({
            method: 'PUT',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission/score/${props.scoringId}/`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              score: score,
            },
          });   
        },
        onSuccess: () => {
          queryClient.invalidateQueries();
          showNotification({
            message: 'Score updated!',
            icon: <IconCheck size={16} />,
          });
        },
        onError: (error) => {
          showNotification({
            message: 'Error updating score.',
            color: 'red',
            icon: <IconAlertTriangle size={16} />,
          });
        }
      }
    );

    const createScore = useMutation({
        mutationFn: async () => {
          await axios({
            method: 'POST',
            url: `${process.env.NEXT_PUBLIC_API_URL}/api/applicationSubmission/${props.applicationSubmissionId}/score`,
            headers: {
              Authorization: `Bearer ${token}`,
            },
            data: {
              scoringCriteriaId: props.scoringCriteriaId,
              score: score,
            },
          });   
        },
        onSuccess: () => {
          showNotification({
            message: 'Score added!',
            icon: <IconCheck size={16} />,
          });
          queryClient.invalidateQueries();
        },
        onError: () => {
          showNotification({
            message: 'Error adding score.',
            color: 'red',
            icon: <IconAlertTriangle size={16} />,
          });
        }
      }
    );

    if (props.initialized) {
        return (
            <Card>
                <Card.Section>
                    <Group align='flex-end'>
                        <NumberInput maw={80} description='From 0-10' max={10} min={0} onChange={(e)=>{setScore(e)}} hideControls defaultValue={score}/>
                        <Button variant="light" size ='sm' onClick={()=>{changeScore.mutate()}}>Update</Button>
                    </Group>
                </Card.Section>
            </Card>
        )
    } else {
        return (
            <Card>
                <Card.Section>
                    <Group align='flex-end'>
                        <NumberInput maw={80} description='From 0-10' max={10} min={0} onChange={(e)=>{setScore(e)}} hideControls/>
                        <Button variant="light" size ='sm' onClick={()=>{createScore.mutate()}}>Update</Button>
                    </Group>
                </Card.Section>
            </Card>
        )
    }
}

export default ScoreInputCard;
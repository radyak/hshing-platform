import { DockerContainerState } from './DockerContainerState';

export interface DockerContainer {

    status: DockerContainerState;
    name: string;
    description: string;
    label: string;
    
}

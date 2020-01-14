import React from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Icon, Button, Label } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            job: this.props.job
        }
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        //url: 'http://localhost:51689/listing/listing/closeJob',
    }

    render() {
        return (
            <Card>
                <Card.Content>            
                    <Card.Header>{this.state.job.title}</Card.Header>
                    <Label as='a' color='black' ribbon='right'>
                        <Icon name='user' />
                        {this.state.job.noOfSuggestions}
                    </Label>
                    <Card.Meta>{this.state.job.location.city}, {this.state.job.location.country}</Card.Meta>
                    <Card.Description className="job-summary">{this.state.job.summary}</Card.Description>
                </Card.Content>
                <Card.Content extra >
                    <Label color='red' size='tiny'>
                        Expired
                    </Label>
                    <Button.Group floated='right' compact size='mini'>
                        <Button basic color='blue'>
                            <Icon name='close' />
                            Close
                        </Button>
                        <Button basic color='blue'>
                            <Icon name='edit' />
                            Edit
                        </Button>
                        <Button basic color='blue'>
                            <Icon name='copy' />
                            Copy
                        </Button>
                    </Button.Group>
                </Card.Content>
            </Card>
        )
    }
}
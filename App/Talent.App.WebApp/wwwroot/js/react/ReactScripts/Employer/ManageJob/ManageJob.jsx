import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Card } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log("constructor loader: ",loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: "",
            jobsFound: true
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        this.renderJobs = this.renderJobs.bind(this);
        this.renderNoJobs = this.renderNoJobs.bind(this);
    };

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });

        this.loadData(() =>
            this.setState({ loaderData })
        );        
    }

    componentDidMount() {
        this.init();
    };

    loadData(callback) {
        var cookies = Cookies.get('talentAuthToken');
       
        $.ajax({
            url: 'http://localhost:51689/listing/listing/getSortedEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            data: {
                'activePage': this.state.activePage,
                'sortbyDate': this.state.sortBy.date,
                'showActive': this.state.filter.showActive,
                'showClosed': this.state.filter.showClosed,
                'showDraft': this.state.filter.showDraft,
                'showExpired': this.state.filter.showExpired,
                'showUnexpired': this.state.filter.showUnexpired
            },
            type: "GET",
            success: function (res) {
                //console.log("Getting jobs: ", res);
                this.setState({
                    loadJobs: res.myJobs
                });
                if (res.totalCount > 0) {
                    this.setState({
                        jobsFound: true
                    });
                } else {
                    this.setState({
                        jobsFound: false
                    });
                }

            }.bind(this)
        })
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    renderJobs() {
        //console.log("Jobs found", this.state.loadJobs);
        return (<div className="ui container">
                    <Card.Group>
                        {this.state.loadJobs.map(job => <JobSummaryCard key={job.id} job={job}/>)}
                    </Card.Group>
                </div>);
    }

    renderNoJobs() {
        //console.log("No jobs found");
        return (<Segment> No jobs found </Segment>);
    }

    render() {
        const filterOptions = [
            {
                key: 'Active',
                text: 'Active',
                value: 'Active'
            },
            {
                key: 'Closed',
                text: 'Closed',
                value: 'Closed'
            },
            {
                key: 'Draft',
                text: 'Draft',
                value: 'Draft'
            },
            {
                key: 'Expired',
                text: 'Expired',
                value: 'Expired'
            },
            {
                key: 'Unexpired',
                text: 'Unexpired',
                value: 'Unexpired'
            }
        ];
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <section className="page-body">
                    <div className="ui container">
                        <header>
                            <h1>List of jobs</h1>
                            <br />
                            <Icon name='filter' />Filter:  
                            <Dropdown
                                className="manage-jobs"
                                text='Choose filter'
                                inline
                                options={filterOptions}
                            />
                            <Icon name='calendar alternate outline' />Sort by date:  
                            <Dropdown
                                className="manage-jobs"
                                text='Newest first'
                                inline>
                                <Dropdown.Menu>
                                    <Dropdown.Item text='other' />                                    
                                </Dropdown.Menu>
                            </Dropdown>
                        </header>
                        {this.state.jobsFound ? this.renderJobs() : this.renderNoJobs()} 
                        <br />
                        <Pagination
                            defaultActivePage={1}
                            ellipsisItem={null}
                            firstItem={null}
                            lastItem={null}
                            siblingRange={1}
                            totalPages={1}
                        />
                        <br />
                    </div>
                </section>
            </BodyWrapper>
        )
    }
}
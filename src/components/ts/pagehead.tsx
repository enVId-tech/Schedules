import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
    page: string;
}

/**
 * ClassHelmet
 * 
 * @param {string} page - The page name.
 * @returns {JSX.Element} - Helmet element.
 * @example <ClassHelmet page="login" />
 */
class ClassHelmet extends React.Component<Props> {
    render() {
        const { page } = this.props;
        return (
            <Helmet>
                <title>Schedules - {page}</title>
            </Helmet>
        );
    }
}

export default ClassHelmet;
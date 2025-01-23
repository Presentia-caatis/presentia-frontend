import { Card } from 'primereact/card';
import { useSchool } from '../../../context/SchoolContext';

const SchoolProfilePage = () => {
    const { schoolData } = useSchool();
    return (
        <div className="p-grid p-justify-center p-mt-6">
            <div className="p-col-12 p-md-6">
                <Card title="School Profile" className="p-shadow-4">
                    <div className="p-fluid">
                        <h3>{schoolData.name ? schoolData.name : "Loading..."}</h3>
                        <p>{schoolData.address ? schoolData.address : "Loading..."}</p>
                        <p>Email: info@smktelkombdg.sch.id</p>
                        <p>Contact: +62 123 456 789</p>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default SchoolProfilePage;

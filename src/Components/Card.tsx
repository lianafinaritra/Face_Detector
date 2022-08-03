import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';

const CardT = (props: any) => {
    const { Header, Text1, Text2 } = props;
    return (
        <>
            <Card className="cardT col-8" bg="white" text='dark'>
                <Card.Header as="h5">{Header}</Card.Header>
                <Card.Body>
                    <Card.Text> {Text1} </Card.Text>
                    <Card.Text> {Text2} </Card.Text>
                </Card.Body>
            </Card>
        </>
    )
}

export default CardT;
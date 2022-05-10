import type {NextPage} from 'next'
import classNames from "classnames";

const Home: NextPage = () => {

    const handleClick = () => {
        alert("clicked");
    }

    return (
        <div>
            <button
                onClick={handleClick}
                className={classNames('p-2','m-32','border','border-blue-800')}>
                click me
            </button>
        </div>
    )
}

export default Home

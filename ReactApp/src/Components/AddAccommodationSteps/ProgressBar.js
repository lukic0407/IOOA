const ProgressBar = (props) => {
    const {currentStep} = props;
    return (
        <>
            <div className="progress-bar-wrap">
                <div className={"step step-1" + (currentStep >= 1 ? ' active' : '')}>
                    <div className="step-number-wrap ">
                        <span className="step-number ">1</span>
                    </div>
                </div>
                <div className={"step step-2" + (currentStep >= 2 ? ' active' : '')}>
                    <div className="step-number-wrap">
                        <span className="step-number">2</span>
                    </div>
                </div>
                <div className={"step step-3" + (currentStep >= 3 ? ' active' : '')}>
                    <div className="step-number-wrap">
                        <span className="step-number">3</span>
                    </div>
                </div>
                <div className={"step step-4" + (currentStep >= 4 ? ' active' : '')}>
                    <div className="step-number-wrap">
                        <span className="step-number">4</span>
                    </div>
                </div>
                <div className={"step step-5" + (currentStep >= 5 ? ' active' : '')}>
                    <div className="step-number-wrap">
                        <span className="step-number">5</span>
                    </div>
                </div>
                <div className={"progress-bar progress-" + currentStep}>

                </div>
            </div>
        </>
    )
}

export default ProgressBar;
import { useEffect, useState } from "react";
import '../../css/ContentStep.css'
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
const RenderContent = (props) => {
    const {
        contentCategoyId,
        handleContentUpdate,
        contentRender
    } = props


    return (
        <> <div className="content-holder">
            {contentRender?.length
                ? (contentRender.map(content => <>
                    <div className="accommodation-single-description">
                        <div className="accommodation-content-wrap">
                            <p><input type='checkbox' categoryId={contentCategoyId} value={content._id} onChange={e => handleContentUpdate(e)}></input>{content.name}</p>
                        </div>
                    </div>
                </>
                )) : <></>
            }
        </div>


        </>
    )
}

export default RenderContent
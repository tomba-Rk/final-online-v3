import React from 'react'

const Wins = ({win,lose,showResult}) => {
    console.log(win)
  return (
    <div>
        {showResult?(
            <>
              <p>{win}</p>
            </>
        ):
            (<p>Wait</p>)}
        
    </div>
  )
}

export default Wins
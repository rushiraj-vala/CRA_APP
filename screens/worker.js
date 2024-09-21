    import newJasperIK from "./InverseKinematics";

onmessage = async(event) => {
    const targetPos = event.data; // Receive array of floats from the main thread
    console.log('Received from main thread:', targetPos);
  
    try {
        ikAngles = await newJasperIk([...targetPos]); 
      } catch (error) {
        console.error(error);
      }
    
    bestResult = []
    bestDistance = Infinity;
    bestTransf = [];

    
    for(i=0;i<8;i++){
      let result = ikAngles[i].map(value => ceil(value*100)/100);
      
      let newTransf = forwarkKinmeatics(result);
      
      let targetDistance = sqrt((x-newTransf[0])*(x-newTransf[0]) + (y-newTransf[1])*(y-newTransf[1]) + (z-newTransf[2])*(z-newTransf[2]));
      
      if(targetDistance<bestDistance){
        bestResult=result;
        bestDistance = targetDistance;
        bestTransf = newTransf;
      }      
      
    }

    let result = ikAngles[7].map(value => ceil(value*100)/100);

    postMessage(result); // Send processed array back to the main thread
  };
import Indaba from './indaba'
import IbpS3 from './ibpS3'
import readline from 'readline'


if (process.argv[2] === 'upload-base-snapshots') {
  const rl = readline.createInterface({
                                        input: process.stdin,
                                        output: process.stdout
                                      });
  let question =
    "This will overwrite any current snapshots with the" +
    "\ncontents of Indaba snapshots endpoint which was last updated" +
    "\non September 2015." +
    "\n\nAre you sure you want to continue? (yes/No): "

  rl.question(question, (answer) => {
    if (answer === 'yes') {
      Indaba.getSnapshots().then((snapshots) => {
        IbpS3.setSnapshot(snapshots).then((res) => {
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      }).catch((err) => {
        console.log(err)
      })
    } else {
      console.log("Exiting.")
    }
    rl.close()
  })
} else if (process.argv[2] === 'update-snapshots') {
  Indaba.getDocuments().then((documents) => {
    IbpS3.updateSnapshots(documents).then((res) => {
      console.log(res)
    }).catch((err) => {
      console.log(err)
    })
  })
}
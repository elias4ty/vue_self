const queue = new Set();
let isFlushing = false;
const p = Promise.resolve();

function queueJob(job) {
  queue.add(job);

  if (!isFlushing) {
    isFlushing = true;

    p.then(() => {
      try {
        queue.forEach((job) => {
          console.log('size---: ', queue.size);
          job();
        });       
      } finally {
        queue.clear();
        isFlushing = false;
      }
    });
  }
}

queueJob(() => { console.log(1) })
console.log('===')
queueJob(() => { console.log(2) })
console.log('===')
queueJob(() => { console.log(3) })
console.log('===')
queueJob(() => { console.log(4) })
console.log('===')
queueJob(() => { console.log(5) })
console.log('===')
queueJob(() => { console.log(6) })
console.log('===')

const total = 5;
for(let progress = 0; progress < 5; progress+=0.5) {
  console.log(`Progress: ${progress}`);
  for(let i=0; i<total; i++) {
    let offset = (i - (progress % total));
    if (offset > total / 2) offset -= total;
    if (offset < -total / 2) offset += total;
    let distance = Math.abs(offset);
    let scale = Math.max(0.75, 1.15 - (distance * 0.25));
    let opacity = Math.max(0, 1 - (distance * 0.4));
    console.log(`  Item ${i}: offset=${offset.toFixed(1)}, dist=${distance.toFixed(1)}, scale=${scale.toFixed(2)}, opacity=${opacity.toFixed(2)}`);
  }
}

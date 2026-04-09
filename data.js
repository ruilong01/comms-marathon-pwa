// STATIC QUESTION BANK
const staticQuestions = [
    // --- True / False (Expansions) ---
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: Two computers on the exact same VLAN can communicate completely without a Router.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Even if they exist on the identical physical switch and same VLAN, they require a Layer-3 device (Router or L3 Switch) to pass logical traffic.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: Ethernet CSMA/CD computers can actively detect collisions while they are transmitting their own data.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. A wired Ethernet card can listen to electrical surges on the physical wire while concurrently speaking (Collision Detection).'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: Wireless (WLAN) antennas can actively detect collisions while transmitting.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. A wireless antenna transmits with immense local power, absolutely deafening itself to incoming weaker signals. Thus it must use Collision AVOIDANCE (CSMA/CA) instead of CD.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: A broadcast MAC address is denoted as 00-00-00-00-00-00.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. A network broadcast MAC address is FF-FF-FF-FF-FF-FF.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: Slotted ALOHA is roughly twice as efficient as Pure (Unslotted) ALOHA.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. Slotted ALOHA has a max efficiency of 1/e (37%), whereas Pure ALOHA forces frames to be completely vulnerable to overlap throughout twice the window size, dropping efficiency to 1/(2e) (18%).'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: Incorporating VLANs into your network will shrink your massive Collision Domains.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. VLANs specifically isolate and shrink BROADCAST domains. Collision domains are already strictly isolated by individual switch ports.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: Token Ring Networks suffer from massive collision probabilities when network traffic is incredibly high.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Token Rings physically CANNOT collide. They use a deterministic "Taking Turns" protocol, guaranteeing zero collisions regardless of network load.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: The 802.1Q VLAN Tag physically increases the size of the Ethernet frame by 4 bytes while travelling on a trunk.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. The protocol explicitly staples a 4-Byte VLAN identifier squarely between the MAC Source and the Type/Length block.'
    },
    // --- MCQs ---
    {
        type: 'mcq',
        prompt: 'The maximum data rate for IEEE 802.11a is _____ Mbps while that for 802.11b is _____ Mbps.',
        options: [
            '11, 54',
            '54, 11',
            '21, 64',
            '64, 21'
        ],
        correctIndex: 1,
        explanation: 'IEEE 802.11a operates in the 5 GHz band and offers a robust 54 Mbps. Alternatively, the older IEEE 802.11b operates in the crowded 2.4 GHz band and maxes out at exactly 11 Mbps. Be careful not to swap them!'
    },
    {
        type: 'mcq',
        prompt: 'The contention based MAC service is offered via the _______ Function in 802.11 WLAN.',
        options: [
            'Frame Coordination',
            'Point Coordination',
            'Distributed Coordination',
            'Infrastructure Coordination'
        ],
        correctIndex: 2,
        explanation: 'The Distributed Coordination Function (DCF) is the absolute foundation of 802.11 MAC, utilizing mathematical CSMA/CA variables to allow multiple independent stations to contend fairly for the airwaves. By contrast, the Point Coordination Function (PCF) is contention-free and centrally controlled by the AP.'
    },
    {
        type: 'mcq',
        prompt: 'The Access Point (AP) and the wireless stations that are affiliated with it collectively form the _______ Set.',
        options: [
            'Server',
            'Destination',
            'MAC',
            'Basic Service'
        ],
        correctIndex: 3,
        explanation: 'A Basic Service Set (BSS) is the fundamental building block of an 802.11 infrastructure network, practically consisting of exactly one central Access Point and all the wireless clients actively linked to it.'
    },
    {
        type: 'mcq',
        prompt: 'The _______ Counter needs to count down to zero before a station can look for the transmission opportunity.',
        options: [
            'Window',
            'Backoff Time',
            'Transmitting',
            'Backup Time'
        ],
        correctIndex: 1,
        explanation: 'Under CSMA/CA, if the medium is busy, a station must generate a random Backoff Time Counter. The station rigorously listens to the air; if it is idle, the counter ticks down. It can only boldly transmit when the counter successfully hits exactly zero.'
    },
    {
        type: 'mcq',
        prompt: 'Before a 802.11 wireless station can access the network services, it must _______ with an Access Point (AP).',
        options: [
            'commit',
            'generate',
            'transmit',
            'associate'
        ],
        correctIndex: 3,
        explanation: 'In 802.11 architecture, a wireless station cannot just start transmitting data. It must first Scan for beacons, formally Authenticate, and finally formally Associate with the Access Point to officially join the BSS.'
    },
    {
        type: 'mcq',
        prompt: 'The backbone network that connects the various APs are known as the _______ System.',
        options: [
            'Distributed',
            'Basic',
            'Service',
            'MAC'
        ],
        correctIndex: 0,
        explanation: 'In 802.11 Wireless LAN architecture, the backbone network physically connecting various Access Points (Basic Service Sets) together is known as the Distributed System (DS).'
    },
    {
        type: 'mcq',
        prompt: 'Which OSI Model Layer is explicitly responsible for end-to-end reliability, establishing connections, and ensuring packets arrive perfectly intact across the network?',
        options: [
            'Layer 2: Data Link Layer',
            'Layer 3: Network Layer',
            'Layer 4: Transport Layer',
            'Layer 7: Application Layer'
        ],
        correctIndex: 2,
        explanation: 'The Transport Layer (Layer 4) handles host-to-host communication and reliability. Protocols like TCP reside here to guarantee end-to-end packet delivery.'
    },
    {
        type: 'mcq',
        prompt: 'When transmitting a frame using flag bytes, what process prevents payload data from accidentally terminating the frame if it matches a flag byte precisely?',
        options: [
            'Cyclic Redundancy Calculation (CRC)',
            'Byte/Bit Stuffing',
            'CSMA/CD Backoff protocol',
            'VLAN Tagging'
        ],
        correctIndex: 1,
        explanation: 'Byte Stuffing (or Bit Stuffing) actively inserts escape characters or zeroes whenever the payload coincidentally mimics a termination flag, preventing premature frame termination.'
    },
    {
        type: 'mcq',
        prompt: 'Why would an application choose to strictly use UDP instead of TCP?',
        options: [
            'UDP perfectly guarantees packet delivery without failure.',
            'UDP possesses robust congestion control for large downloads.',
            'UDP establishes an intensive 3-way handshake to secure military data.',
            'UDP avoids all connection overhead, drastically reducing latency for real-time streaming.'
        ],
        correctIndex: 3,
        explanation: 'UDP is a connectionless protocol. It does not wait for ACKs or handshakes, rendering it lightning-fast but completely unreliable. It is the gold standard for latency-sensitive apps like VoIP and gaming where speed outweighs dropped packets.'
    },
    {
        type: 'mcq',
        prompt: 'Which hardware device breaks up a network into multiple distinct isolated Collision Domains, but leaves the entire physical structure as one massive Broadcast Domain?',
        options: [
            'A Layer 1 Hub',
            'A Layer 2 Switch',
            'A Layer 3 Router',
            'A Token Ring'
        ],
        correctIndex: 1,
        explanation: 'A Switch. Every single port on a switch is its own collision domain. However, a switch will happily pass broadcast frames (FF-FF-FF-FF-FF-FF) to all ports, meaning it remains one large Broadcast domain.'
    },
    {
        type: 'mcq',
        prompt: 'Under CSMA/CA, if a node physically suffers a failure to transmit, its random Backoff Time Counter (BTC) limit...',
        options: [
            'Resets to zero immediately.',
            'Doubles exponentially without any possible ceiling limit.',
            'Increases exponentially up to a hard cap established by k=10.',
            'Drops the frame identically to CSMA/CD.'
        ],
        correctIndex: 2,
        explanation: 'The backoff scale expands `m = min(m+f, 10)`, exponentially growing the backoff window up to a maximum multiplier array of 1023.'
    },
    {
        type: 'mcq',
        prompt: 'The "Hidden Terminal" problem in WLAN explicitly causes collisions because:',
        options: [
            'The Access Point is physically too far to hear any computers.',
            'Computer A and Computer B can both hear the Access Point, but physically cannot hear each other.',
            'Computer A is encrypting data so Computer B ignores it.',
            'VLANs block the broadcast domain.'
        ],
        correctIndex: 1,
        explanation: 'If A and B cannot hear each other, they will simultaneously transmit to the central AP believing the airwaves are perfectly empty, generating a massive collision. CSMA/CA uses RTS/CTS handshakes to prevent this.'
    },

    // --- Fill in the Blank ---
    {
        type: 'fitb',
        prompt: 'The OSI model has exactly _____ physical layers (number only).',
        correctAnswers: ['7'],
        explanation: 'OSI specifies absolutely 7 layers: App, Presentation, Session, Transport, Network, Link, Physical. TCP/IP squashes the top three into just one layer.'
    },
    {
        type: 'fitb',
        prompt: 'To fix Hidden Terminals, WLAN Access Points shout a _____ frame (3-letter abbreviation) to explicitly authorize a computer to transmit data without interruptions.',
        correctAnswers: ['cts'],
        explanation: 'The Access Point shouts a CTS (Clear To Send) back to a transmitting node. Because the AP shouts it loudly, all hidden hidden nodes hear the CTS and know to wait!'
    },
    {
        type: 'fitb',
        prompt: 'If a CSMA/CD Ethernet frame encounters absolutely _____ consecutive collisions, it completely aborts and drops the transmission permanently.',
        correctAnswers: ['16', 'sixteen'],
        explanation: 'Standard Ethernet protocol drops the packet entirely after experiencing 16 sequential collisions.'
    },

    // --- Drag and Drop Match ---
    {
        type: 'dnd',
        prompt: 'Match the Access Control Protocol to its defining characteristic:',
        matches: [
            { id: 'm1', label: 'TDMA / FDMA', correctDrop: 'd1', answerText: 'Channel Partitioning (0 Collisions, but bottlenecked at low loads)' },
            { id: 'm2', label: 'CSMA/CD & ALOHA', correctDrop: 'd2', answerText: 'Random Access (Fastest possible access, but horrible heavy traffic crashes)' },
            { id: 'm3', label: 'Polling / Token', correctDrop: 'd3', answerText: 'Taking Turns (Guaranteed fairness deterministically)' }
        ],
        explanation: 'Channel partitions hardcode strict lanes. Random access just screams into the void. Taking Turns mathematically passes the microphone.'
    },


];

// DYNAMIC GENERATORS (Calculations)
const dynamicGenerators = [
    {
        // 1. Minimum Slot Time randomizer
        generate: () => {
            let distance = Math.floor(Math.random() * 800) + 200; 
            let delayRaw = distance / 200; 
            let slotTime = delayRaw * 2; 
            let formattedSlot = parseFloat(slotTime.toFixed(3));
            
            return {
                type: 'fitb',
                prompt: `DYNAMIC CALCULATION: A 10 Mbps CSMA/CD Ethernet has a physical signal speed of 2 × 10^8 m/s. The maximum distance between the furthest two computers is ${distance} meters. What is the EXACT minimum Slot Time in microseconds required to detect a collision? (Type number only)`,
                correctAnswers: [String(formattedSlot)],
                explanation: `Minimum Slot Time = 2 * one-way propagation delay (d) \n\nd = Distance / Speed\nd = ${distance} / 2×10^8 m/s = ${delayRaw} microseconds.\nSlot Time ≥ 2 * ${delayRaw} = ${formattedSlot} microseconds.`
            };
        }
    },
    {
        // 2. Exact probability of a collision repeater
        generate: () => {
            let m_A = Math.floor(Math.random() * 4) + 1; 
            let m_B = Math.floor(Math.random() * 4) + m_A; 
            
            let rangeA = Math.pow(2, m_A);
            let rangeB = Math.pow(2, m_B);
            
            let totalCombos = rangeA * rangeB;
            let clashes = rangeA; 
            let prob = clashes / totalCombos;
            let formattedProb = parseFloat(prob.toFixed(4));
            
            return {
                type: 'fitb',
                prompt: `DYNAMIC CALCULATION: Station X is on its ${m_A}th collision. Station Y is on its ${m_B}th collision. If they both wait and try again, what is the exact probability (in decimal format) they randomly pick the identical K and crash again?`,
                correctAnswers: [String(prob), String(formattedProb)],
                explanation: `Station X chooses from ${rangeA} values. Station Y chooses from ${rangeB} values.\nTotal possible network combinations = ${rangeA} * ${rangeB} = ${totalCombos}.\nSince Station X has fewer choices, they can entirely clash ${clashes} times.\nProbability = ${clashes} / ${totalCombos} = ${prob}.`
            };
        }
    },
    {
        // 3. Dynamic Hardware True/False
        generate: () => {
            const devices = [
                { name: 'A Layer 1 Hub', traits: ['merges all plugged-in computers into one massive collision domain'] },
                { name: 'A Layer 2 Switch', traits: ['separates collision domains perfectly per port'] },
                { name: 'A Layer 3 Router', traits: ['breaks up and shrinks broadcast domains'] },
                { name: 'VLAN Trunking', traits: ['allows multiple virtual networks to traverse a single cable via 4-Byte tags'] }
            ];
            
            let actualDevice = devices[Math.floor(Math.random() * devices.length)];
            let isTrue = Math.random() > 0.5;
            let displayedTrait = isTrue ? actualDevice.traits[0] : devices.filter(d => d.name !== actualDevice.name)[Math.floor(Math.random() * 3)].traits[0];
            
            return {
                type: 'mcq',
                prompt: `DYNAMIC T/F: TRUE OR FALSE: ${actualDevice.name} literally ${displayedTrait}.`,
                options: ['True', 'False'],
                correctIndex: isTrue ? 0 : 1,
                explanation: isTrue ? `True. That is explicitly the functional design of ${actualDevice.name}.` : `False. ${actualDevice.name} DOES NOT operate like that.`
            };
        }
    },
    {
        // 4. Dynamic Protocol True/False
        generate: () => {
            const protocols = [
                { name: 'CSMA/CD (Ethernet)', trait: 'actively detects electrical collisions concurrently during data transmission' },
                { name: 'CSMA/CA (WLAN)', trait: 'utilizes RTS/CTS handshake reservations because its antenna physically cannot listen while screaming' },
                { name: 'Token Ring', trait: 'is deterministically incapable of experiencing physical packet collisions' },
                { name: 'Slotted ALOHA', trait: 'possesses a maximum theoretical transmission efficiency of roughly 37% (1/e)' },
                { name: 'Pure ALOHA', trait: 'possesses a maximum theoretical transmission efficiency of roughly 18% (1/2e)' }
            ];
            
            let proto = protocols[Math.floor(Math.random() * protocols.length)];
            let isTrue = Math.random() > 0.5;
            let wrongProtos = protocols.filter(p => p.name !== proto.name);
            let displayedTrait = isTrue ? proto.trait : wrongProtos[Math.floor(Math.random() * wrongProtos.length)].trait;
            
            return {
                type: 'mcq',
                prompt: `DYNAMIC T/F: TRUE OR FALSE: The ${proto.name} protocol ${displayedTrait}.`,
                options: ['True', 'False'],
                correctIndex: isTrue ? 0 : 1,
                explanation: isTrue ? `True. This perfectly correctly describes the ${proto.name} mechanism.` : `False. That is factually incorrect for ${proto.name}.`
            };
        }
    },
    // ===================================
    // MASSIVE TUTORIAL CALCULATORS
    // ===================================
    {
        // 5. Advanced Repeater Slot Time Generator (Week 10)
        generate: () => {
            let busDist = Math.floor(Math.random() * 400) + 100;
            let dropCable = 10;
            let totalDist = busDist + (dropCable * 2); 
            
            let distDelayMicro = (totalDist / 200000000) * 1000000;
            let repeaterBits = Math.floor(Math.random() * 6) + 4; 
            
            // 10 Mbps repeater bit delay calculation
            let repDelayMicro = (repeaterBits / 10000000) * 1000000;
            
            let maxOneWay = distDelayMicro + repDelayMicro;
            let slotTime = 2 * maxOneWay;
            let formattedSlot = parseFloat(slotTime.toFixed(3));
            
            return {
                type: 'fitb',
                prompt: `TUTORIAL CALCULATOR (Week 10): \nA 10 Mb/s Ethernet bus is exactly ${busDist}m long. Two endpoint hosts flawlessly connect to the extreme opposite ends using ${dropCable}m drop cables. \nExactly in the absolute physical center of the entire bus is a Repeater that naturally introduces a processing delay of ${repeaterBits} bits.\nSignal velocity is 2x10^8 m/s. \nCalculate the critically necessary EXACT Minimum Slot Time in microseconds.`,
                correctAnswers: [String(formattedSlot)],
                explanation: `1. Physical Distance = ${busDist} + ${dropCable}*2 = ${totalDist} m.\n2. Cable Delay = ${totalDist}/2x10^8 = ${distDelayMicro} us.\n3. Repeater Bit Delay = ${repeaterBits} bits / 10,000,000 bps = ${repDelayMicro} us.\n4. Total One-Way Delay (d) = ${distDelayMicro} + ${repDelayMicro} = ${maxOneWay} us.\n5. Minimum Slot time = 2 * d = ${formattedSlot} us.`
            };
        }
    },
    {
        // 6. Advanced DCF Countdown Timeline (Week 11)
        generate: () => {
            let btc = Math.floor(Math.random() * 25) + 15; 
            let difs = [40, 50, 60][Math.floor(Math.random() * 3)];
            let slot = 20;
            
            let timeline = [];
            let totalSimulatedTime = 0;
            let btcRemaining = btc;
            
            let isBusy = true;
            let explanationText = `BTC Initial Generation: ${btc}. DIFS Threshold: ${difs}ms. Slot Duration: ${slot}ms.\n\n`;
            let iterationCount = 1;
            
            while(btcRemaining > 0) {
                if (isBusy) {
                    let busyDur = Math.floor(Math.random() * 300) + 100;
                    timeline.push({state: 'Busy', dur: busyDur});
                    totalSimulatedTime += busyDur;
                    explanationText += `${iterationCount}) Busy ${busyDur}ms -> Line paused.\n`;
                } else {
                    // Random free periods large enough to eventually whittle down BTC
                    let freeDurRaw = Math.floor(Math.random() * (btcRemaining > 10 ? 300 : 800)) + difs + 10; 
                    
                    let usable = freeDurRaw - difs;
                    let ticks = Math.floor(usable / slot);
                    
                    if (btcRemaining <= ticks) {
                        let timeSpent = difs + (btcRemaining * slot);
                        timeline.push({state: 'Free', dur: freeDurRaw, term: true});
                        totalSimulatedTime += timeSpent;
                        explanationText += `${iterationCount}) Free ${freeDurRaw}ms -> Wait DIFS (${difs}ms). BTC rapidly counts down the ultimate ${btcRemaining} slots. Hits exactly 0! Time spent this block: ${difs} + (${btcRemaining}*${slot}) = ${timeSpent}ms.\n`;
                        btcRemaining = 0;
                    } else {
                        timeline.push({state: 'Free', dur: freeDurRaw});
                        totalSimulatedTime += freeDurRaw;
                        btcRemaining -= ticks;
                        explanationText += `${iterationCount}) Free ${freeDurRaw}ms -> Wait DIFS (${difs}ms). Usable: ${usable}ms. Ticks ${ticks} times down. BTC becomes physically ${btcRemaining}.\n`;
                    }
                }
                isBusy = !isBusy;
                iterationCount++;
            }
            
            let promptList = timeline.map((t, idx) => `  ${idx+1}) ${t.state} for ${t.dur} ms ${t.term ? '(BTC hits 0 here)' : ''}`).join('\n');
            
            return {
                type: 'fitb',
                prompt: `EXTREME TUTORIAL CALCULATOR (Week 11): \nA complex DCF mode station successfully generates a random value of exactly ${btc} for its Back-off Time Counter (BTC) at exact time instant t0. The station rigorously detects the wireless medium to be busy/free in the following dynamic sequence:\n\n${promptList}\n\nAssume rigorously that DCF InterFrame Spacing (DIFS) is ${difs} ms and slot time is strictly ${slot} ms. \nPhysically how much time absolutely after t0 will BTC aggressively count down to zero? (Type integer for ms)`,
                correctAnswers: [String(totalSimulatedTime), String(totalSimulatedTime) + " ms", String(totalSimulatedTime) + "ms"],
                explanation: `Final Total Time: ${totalSimulatedTime} ms\n\nDeep Walkthrough:\n` + explanationText + `\nGrand Total Accumulation: ${totalSimulatedTime} ms.`
            }
        }
    },
    {
        // 7. Dynamic Switch Table Updates (Week 10)
        generate: () => {
            let maxTTL = Math.floor(Math.random() * 50) + 70; // 70 to 120
            let arrivalTime = Math.floor(Math.random() * 30) + 10;
            let pName = ['Node X', 'MAC A', 'Device 4'][Math.floor(Math.random() * 3)];
            
            let shouldArrive = Math.random() > 0.5;
            let answer, promptText, explanation;
            
            if (shouldArrive) {
                answer = String(maxTTL);
                promptText = `DYNAMIC TUTORIAL (Week 10): A complex switch table has a maximum Aging Time (TTL) of ${maxTTL} seconds. At time t0, the entry critically linking to ${pName} has aged down to a TTL of ${maxTTL - 15}. At exactly t0 + ${arrivalTime} seconds, the switch suddenly receives a brand new routing frame FROM ${pName}. \nWhat is the new numerical TTL value for ${pName} immediately after this frame is received?`;
                explanation = `The switch automatically learns and refreshes its tables based purely on the SOURCE address. Whenever an active frame is received originating FROM a device, the switch realizes it is still alive and instantly resets its Time-To-Live completely back up to the maximum physical limit of ${maxTTL}.`;
            } else {
                let initialTTL = Math.floor(Math.random() * 20) + 40; 
                answer = String(initialTTL - arrivalTime);
                promptText = `DYNAMIC TUTORIAL (Week 10): A switch table evaluates aging with a max TTL of ${maxTTL} seconds. At time t0, the entry corresponding to ${pName} has a TTL of ${initialTTL}. At exactly t0 + ${arrivalTime} seconds, the switch routes a massive payload frame specifically TO ${pName}. Absolutely no frames are ever sent FROM ${pName} during this time window. \nWhat is the new numerical TTL value for ${pName} precisely at t0 + ${arrivalTime}?`;
                explanation = `Trick question! Switches ONLY refresh the aging timer when receiving a frame ORIGINATING FROM that computer (which proves it is actively alive on that inbound port). Merely sending a frame TO ${pName} does absolutely nothing to inform the switch's source-tracking logic. Thus the timer just strictly continues counting down: ${initialTTL} - ${arrivalTime} = ${answer} seconds remaining.`;
            }
            return { type: 'fitb', prompt: promptText, correctAnswers: [answer], explanation: explanation };
        }
    },
    {
        // 8. Dynamic Slotted ALOHA success slots (Week 9)
        generate: () => {
            let probA = [0.2, 0.4, 0.5][Math.floor(Math.random() * 3)];
            let probB = [0.1, 0.3, 0.5][Math.floor(Math.random() * 3)];
            let targetSlot = Math.floor(Math.random() * 5) + 3; // slot 3 to 7
            
            let probSuccessInAnySlot = probA * (1 - probB);
            let probFailInAnySlot = 1 - probSuccessInAnySlot;
            
            let finalProb = Math.pow(probFailInAnySlot, targetSlot - 1) * probSuccessInAnySlot;
            let fmtProb = parseFloat(finalProb.toFixed(4));
            
            return {
                type: 'fitb',
                prompt: `DYNAMIC TUTORIAL (Week 9): Two highly active nodes A and B utilize a Slotted ALOHA framework. Node A forcefully attempts transmission with probability ${probA}. Node B attempts transmission with probability ${probB}.\nIf the first attempt is Slot 1, calculate the exact statistical probability that Node A succeeds safely for the VERY FIRST TIME strictly in Slot ${targetSlot}.\n(Ensure answer is a decimal strictly rounded to max 4 decimal places)`,
                correctAnswers: [String(fmtProb), String(finalProb)],
                explanation: `1) The sole probability A succeeds safely in ANY given slot without collision = [\`A\` transmits] AND [\`B\` is quiet] = ${probA} * (1 - ${probB}) = ${probSuccessInAnySlot.toFixed(3)}.\n2) Conversely, the probability of complete failure in any slot = 1 - ${probSuccessInAnySlot.toFixed(3)} = ${probFailInAnySlot.toFixed(3)}.\n3) To succeed for the very first time specifically in slot ${targetSlot}, A must aggressively FAIL exactly ${targetSlot - 1} times sequentially, and then succeed precisely once.\n4) Formula: (${probFailInAnySlot.toFixed(3)})^${targetSlot - 1} * ${probSuccessInAnySlot.toFixed(3)} = ${fmtProb}.`
            };
        }
    },
    {
        // 9. Procedural Peering / Standards True False
        generate: () => {
             let concepts = [
                { name: 'Internet Peering', trueT: 'is completely voluntary and relies on mutual agreements between ISP networks to exchange traffic', falseT: 'is a globally mandatory tax enforced strictly by the government to transfer packets across subnets' },
                { name: 'IETF Standards', trueT: 'are absolutely strictly voluntary, but universally adopted rapidly out of pure developmental utility', falseT: 'are strictly legally enforced by robust international telecommunications law to prevent collisions' },
                { name: 'An 802.11b to 802.11g WLAN upgrade', trueT: 'is simple logically because both cleanly utilize the identical 2.4 GHz physical spectrum natively', falseT: 'is impossible without buying all new routing antennas because one operates uniquely on 7 GHz laser bands' },
                { name: 'An 802.11b to 802.11a WLAN upgrade', trueT: 'is notoriously difficult backward-compatibility wise because 802.11a uniquely runs on the 5 GHz band rather than 2.4 GHz', falseT: 'is the default flawless migration path because they both use exactly 2.4 GHz frequencies completely redundantly' }
            ];
            
            let concept = concepts[Math.floor(Math.random() * concepts.length)];
            let isTrue = Math.random() > 0.5;
            let displayedTrait = isTrue ? concept.trueT : concept.falseT;
            
            return {
                type: 'mcq',
                prompt: `DYNAMIC TUTORIAL T/F: TRUE OR FALSE: ${concept.name} ${displayedTrait}.`,
                options: ['True', 'False'],
                correctIndex: isTrue ? 0 : 1,
                explanation: isTrue ? 'True. That is exactly fundamentally correct based strictly on the tutorial definitions.' : 'False. That entirely violently violates the core tutorial definitions for this networking standard!'
            };
        }
    }
];

// Master Function to export to app.js
function getRandomQuestion() {
    // Huge 70% chance of throwing a totally random procedurally generated math/logic problem, 30% static
    if(Math.random() < 0.70) {
        let generator = dynamicGenerators[Math.floor(Math.random() * dynamicGenerators.length)];
        return generator.generate();
    } else {
        return staticQuestions[Math.floor(Math.random() * staticQuestions.length)];
    }
}

// STATIC QUESTION BANK
const staticQuestions = [
    // --- True / False (Expansions) ---
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: An analog signal sampled at exactly its highest frequency (Fs = F_max) can be perfectly reconstructed without aliasing.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The Nyquist-Shannon theorem explicitly states Fs must be STRICTLY GREATER THAN 2*F_max. Sampling exactly at or below leads to severe aliasing.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: The discrete unit impulse function δ[n] has a value of 1 for all positive indices of n.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. The discrete unit impulse is exactly 1 at n=0, and 0 everywhere else.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: If x[n] = (1.5)^n, the signal will exponentially decay towards zero as n increases.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. Because the base (1.5) is greater than 1, raising it to a higher exponent causes it to grow to infinity. A base < 1 represents decay.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: Two digital sinusoids can look completely identical even if they were sampled from two analog waves of wildly different frequencies.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True! Because of Aliasing, if a high frequency wave is sampled too slowly, it maps down to the exact identical sequence of discrete points as a low frequency wave.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: The operation x[n - 3] mathematically shifts the signal to the left on a graph, predicting the future.',
        options: ['True', 'False'],
        correctIndex: 1,
        explanation: 'False. A subtraction like [n - 3] introduces a DELAY. Plotting it graphically pushes all the values 3 steps to the RIGHT.'
    },
    {
        type: 'mcq',
        prompt: 'TRUE OR FALSE: FIR (Finite Impulse Response) filters are inherently and unconditionally stable.',
        options: ['True', 'False'],
        correctIndex: 0,
        explanation: 'True. FIR filters have absolutely no feedback loop mathematically (no y[n-1] terms). Because they cannot feed into themselves indefinitely, they are unconditionally stable.'
    },

    // --- MCQs ---
    {
        type: 'mcq',
        prompt: `Pole zero plot: (unit circle is shown)<br>
<svg viewBox="-1.5 -1.5 3 3" width="120" height="120" style="background:#fff; padding:10px; border-radius:8px; margin-top:15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
    <circle cx="0" cy="0" r="1" fill="none" stroke="#555" stroke-width="0.04"/>
    <circle cx="0.5" cy="-0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="-0.5" cy="-0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.5" cy="0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="-0.5" cy="0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0" cy="-1" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0" cy="1" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
</svg><br>What type of filter is this?`,
        options: [
            'The filter is IIR.',
            'The filter is FIR.',
            'The filter is Analog.',
            'The filter is unstable.'
        ],
        correctIndex: 1,
        explanation: 'Because there are absolutely no explicit poles plotted (except inherently at the origin for causality), this filter possesses no feedback mathematically. Thus, it is purely an FIR (Finite Impulse Response) filter!'
    },
    {
        type: 'mcq',
        prompt: `Pole zero plot: (unit circle is shown)<br>
<svg viewBox="-1.5 -1.5 3 3" width="120" height="120" style="background:#fff; padding:10px; border-radius:8px; margin-top:15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
    <circle cx="0" cy="0" r="1" fill="none" stroke="#555" stroke-width="0.04"/>
    <circle cx="0.5" cy="-0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="-0.5" cy="-0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.5" cy="0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="-0.5" cy="0.866" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0" cy="-1" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0" cy="1" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
</svg><br>Identify the coefficient property of this filter:`,
        options: [
            'The filter has real coefficients.',
            'The filter does NOT have real coefficients.',
            'The filter has only imaginary coefficients.',
            'The filter coefficients are infinitely repeating.'
        ],
        correctIndex: 0,
        explanation: 'Look closely at the graphical layout! Every specific zero plotted in the upper-half complex plane has a perfect mirror-image reflection in the lower-half plane. Because they obey perfect Complex Conjugate Symmetry, the filter strictly possesses REAL coefficients.'
    },
    {
        type: 'mcq',
        prompt: `Pole zero plot:<br>
<svg viewBox="-1.5 -1.5 3 3" width="120" height="120" style="background:#fff; padding:10px; border-radius:8px; margin-top:15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
    <circle cx="0" cy="0" r="1" fill="none" stroke="#555" stroke-width="0.04"/>
    <circle cx="0.4" cy="-0.6" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.4" cy="0.6" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.4" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="1" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="1.4" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
</svg><br>Estimate the frequency response type of this filter:`,
        options: [
            'The filter is allpass',
            'The filter is not allpass (we may guess it is a lowpass)',
            'The filter is not allpass (we may guess it is a highpass)',
            'The filter is not allpass (we may guess it is a bandpass)'
        ],
        correctIndex: 2,
        explanation: 'A zero dictates where the filter forcefully blocks frequencies. Notice there is a zero situated exactly at z = 1 (the far right edge of the unit circle). This point perfectly corresponds to ω = 0 (DC / low frequencies). A filter that blocks DC is explicitly a highpass filter!'
    },
    {
        type: 'mcq',
        prompt: `Pole zero plot:<br>
<svg viewBox="-1.5 -1.5 3 3" width="120" height="120" style="background:#fff; padding:10px; border-radius:8px; margin-top:15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
    <circle cx="0" cy="0" r="1" fill="none" stroke="#555" stroke-width="0.04"/>
    <circle cx="0.4" cy="-0.6" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.4" cy="0.6" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.4" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="1" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="1.4" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
</svg><br>Identify the phase characteristics:`,
        options: [
            'The filter is linear phase',
            'The filter is minimum phase',
            'The filter is maximum phase',
            'The filter is none of these'
        ],
        correctIndex: 3,
        explanation: 'It is NOT minimum phase because an offending zero exists outside the unit circle (at 1.4). It is NOT maximum phase because zeros exist inside. It is NOT linear phase because the linear-phase reciprocal symmetry constraint (mapping pair z0 and 1/z0) is utterly violated. Hence, none of these.'
    },
    {
        type: 'mcq',
        prompt: `Pole zero plot:<br>
<svg viewBox="-1.5 -1.5 3 3" width="120" height="120" style="background:#fff; padding:10px; border-radius:8px; margin-top:15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
    <circle cx="0" cy="0" r="1" fill="none" stroke="#555" stroke-width="0.04"/>
    <circle cx="0.4" cy="-0.6" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.4" cy="0.6" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="0.4" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="1" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
    <circle cx="1.4" cy="0" r="0.08" fill="none" stroke="#ff3366" stroke-width="0.06"/>
</svg><br>Assess the physical stability of this system:`,
        options: [
            'The filter is (causal) stable',
            'The filter is (causal) unstable',
            'The filter is marginally stable',
            'The filter oscillates to infinity'
        ],
        correctIndex: 0,
        explanation: 'Examiner Trap! Stability is determined EXCLUSIVELY by the graphical placement of the POLES (which dictate the feedback loop!). Even though a zero resides aggressively outside the unit circle, the zeros only affect feed-forward paths. Since there are strictly no poles outside the unit circle, the FIR filter is inherently stable.'
    },
    {
        type: 'mcq',
        prompt: 'Which mathematical condition dictates if a Discrete-Time sinusoid is perfectly periodic?',
        options: [
            'Its amplitude must strictly not exceed 1.',
            'Its normalized frequency 2π(F/Fs) must yield a perfectly rational fraction.',
            'It must be passed through a Low-Pass Butterworth filter first.',
            'It just is. All sinusoids are periodic.'
        ],
        correctIndex: 1,
        explanation: 'In the digital world, periodicity is not guaranteed! The period N = 2π/ω must equal an integer/rational number for the sequence to genuinely repeat the identical discrete samples.'
    },
    {
        type: 'mcq',
        prompt: 'What happens mathematically when you apply Time Reversal to a signal x[-n]?',
        options: [
            'The signal is inverted vertically across the X-axis.',
            'The signal is reflected horizontally precisely around the Y-axis (n=0).',
            'All odd samples are immediately destroyed.',
            'The signal drops by a phase shift of 90 degrees.'
        ],
        correctIndex: 1,
        explanation: 'x[-n] flips the timeline! Everything that occurred at n=5 now sits at n=-5. It mirrors cleanly around n=0 (the Y-axis).'
    },
    
    // --- Fill in the Blank ---
    {
        type: 'fitb',
        prompt: 'To absolutely prevent Aliasing, if your highest analog frequency is 4000 Hz, what is the absolute minimum integer sampling rate you must use? (Value > X)',
        correctAnswers: ['8000', '8000Hz'],
        explanation: 'Nyquist Theorem dictates Fs > 2*F_max. 2 * 4000 = 8000. You must sample strictly greater than 8000 Hz!'
    },
    {
        type: 'fitb',
        prompt: 'An IIR filter differs from an FIR filter primarily because it contains a mathematical _____ loop.',
        correctAnswers: ['feedback'],
        explanation: 'Infinite Impulse Response (IIR) filters calculate current outputs using PREVIOUS outputs (e.g. y[n-1]). This creates an infinite feedback loop!'
    },

    // --- Drag and Drop Match ---
    {
        type: 'dnd',
        prompt: 'Match the mathematical notation to its physical DSP transformation:',
        matches: [
            { id: 'm1', label: 'x[n - k]', correctDrop: 'd1', answerText: 'Time Delay (Shift Right)' },
            { id: 'm2', label: 'x[-n]', correctDrop: 'd2', answerText: 'Time Reversal (Flip Y-axis)' },
            { id: 'm3', label: 'x[2n]', correctDrop: 'd3', answerText: 'Time Compression (Decimation)' }
        ],
        explanation: 'Minus K delays. Minus n reverses. Multiplying n compresses via discarding samples!'
    }
];

// DYNAMIC GENERATORS (Calculations)
const dynamicGenerators = [
    {
        // 1. Dynamic Nyquist Calculator
        generate: () => {
            let fmax = Math.floor(Math.random() * 50) * 100 + 2000; // e.g. 2000 to 7000 Hz
            let nyquist = fmax * 2; 
            
            return {
                type: 'fitb',
                prompt: `DYNAMIC CALCULATION: You are attempting to sample a complex analog orchestra waveform. The absolute highest frequency component in the spectrum is precisely ${fmax} Hz. What is the lowest theoretical Nyquist threshold frequency (Fs) you must exceed to prevent Aliasing? (Type integer only)`,
                correctAnswers: [String(nyquist)],
                explanation: `Nyquist Threshold = 2 * F_max \nF_max = ${fmax} Hz.\nThreshold = 2 * ${fmax} = ${nyquist} Hz. Note that you must sample >${nyquist} physically.`
            };
        }
    },
    {
        // 2. Dynamic Z-Transform Delay
        generate: () => {
            let delayFactor = Math.floor(Math.random() * 8) + 2; 
            
            return {
                type: 'mcq',
                prompt: `DYNAMIC TRANSFORMATION: If you take the time-domain signal x[n - ${delayFactor}], what is its equivalent operation in the Z-domain?`,
                options: [
                    `Z^${delayFactor} * X(z)`,
                    `Z^-${delayFactor} * X(z)`,
                    `X(z - ${delayFactor})`,
                    `${delayFactor} * X(z)`
                ],
                correctIndex: 1,
                explanation: `The time shifting property of the Z-transform states that a physical time delay of k samples equates strictly to multiplying the entire Z-domain expression by Z^-k. Thus: Z^-${delayFactor} * X(z).`
            };
        }
    },
    {
        // 3. Dynamic Periodicity Evaluator
        generate: () => {
            let k = Math.floor(Math.random() * 5) + 1;
            let N_val = [4, 7, 8, 12, 16][Math.floor(Math.random() * 5)];
            
            let isPeriodic = Math.random() > 0.4;
            let displayW;
            let answerText;
            
            if (isPeriodic) {
                // To be periodic, N = 2pi / ω * k must be rational integer. 
                // That means ω = (2pi * k) / N
                displayW = `(${2*k}π / ${N_val})`;
                promptText = `DYNAMIC PERIODICITY: A digital discrete-time sinusoid has an angular frequency of ω = ${displayW}. Is this sequence mathematically guaranteed to be periodic?`;
                answerText = "Yes";
            } else {
                // Non periodic involves irrational components or missing pi!
                displayW = `(${Math.floor(Math.random()*5)+1} / ${N_val})`; // No Pi!
                promptText = `DYNAMIC PERIODICITY: A digital discrete-time sinusoid has an angular frequency of ω = ${displayW}. Is this sequence mathematically guaranteed to be periodic?`;
                answerText = "No";
            }

            return {
                type: 'mcq',
                prompt: promptText,
                options: ['Yes', 'No'],
                correctIndex: isPeriodic ? 0 : 1,
                explanation: isPeriodic ? `Yes! The fundamental period is derived from 2π / ω. Evaluating 2π / (${2*k}π / ${N_val}) yields a pure rational number. Therefore, it is guaranteed periodic!` : `No! For a discrete wave to be periodic, 2π / ω must yield a rational number. Because the supplied ω (${displayW}) lacks π, evaluating 2π / ω produces an irrational number, proving it will never physically repeat exactly.`
            };
        }
    }
];

// Master Function to export to app.js
function getRandomQuestion() {
    // 50% chance of throwing a totally random procedurally generated math/logic problem, 50% static
    if(Math.random() < 0.50) {
        let generator = dynamicGenerators[Math.floor(Math.random() * dynamicGenerators.length)];
        return generator.generate();
    } else {
        return staticQuestions[Math.floor(Math.random() * staticQuestions.length)];
    }
}

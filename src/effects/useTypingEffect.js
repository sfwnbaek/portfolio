import { useState, useEffect, useRef } from 'react';

/**
 * useTypingEffect
 * @param {string|string[]} input - single string to type once, or array to cycle through
 * @param {number} speed - ms per character while typing
 * @param {object} options
 *   - cycle: boolean, loop through the array forever (delete + retype)
 *   - active: boolean, pauses the effect until true (e.g. wait for name to finish first)
 *   - deleteSpeed: ms per character while deleting (cycle mode only)
 *   - pause: ms to hold before deleting (cycle mode only)
 *   - startDelay: ms before typing begins
 * @returns {{ text: string, done: boolean }}
 */
export default function useTypingEffect(input, speed = 90, options = {}) {
    const {
        cycle = false,
        active = true,
        deleteSpeed = 45,
        pause = 1400,
        startDelay = 0
    } = options;

    const words = Array.isArray(input) ? input : [input];
    const [text, setText] = useState('');
    const [done, setDone] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (!active) return undefined;

        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let started = false;

        function tick() {
            const currentWord = words[wordIndex] || '';

            if (!isDeleting) {
                charIndex++;
                setText(currentWord.substring(0, charIndex));

                if (charIndex === currentWord.length) {
                    if (!cycle) {
                        setDone(true);
                        return;
                    }
                    isDeleting = true;
                    timeoutRef.current = setTimeout(tick, pause);
                    return;
                }
            } else {
                charIndex--;
                setText(currentWord.substring(0, charIndex));

                if (charIndex === 0) {
                    isDeleting = false;
                    wordIndex = (wordIndex + 1) % words.length;
                    timeoutRef.current = setTimeout(tick, 300);
                    return;
                }
            }

            timeoutRef.current = setTimeout(tick, isDeleting ? deleteSpeed : speed);
        }

        function start() {
            if (started) return;
            started = true;
            tick();
        }

        timeoutRef.current = setTimeout(start, startDelay);

        return () => clearTimeout(timeoutRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active, cycle]);

    return { text, done };
}
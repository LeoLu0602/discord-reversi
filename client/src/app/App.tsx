import { SyncContextProvider } from '@robojs/sync';
import { BrowserRouter, Routes, Route } from 'react-router';
import { DiscordContextProvider } from '../hooks/useDiscordSdk';
import { Activity } from './Activity';
import Home from './Home';
import './App.css';

/**
 * Set `authenticate` to true to enable Discord authentication.
 * You can also set the `scope` prop to request additional permissions.
 *
 * ```
 * <DiscordContextProvider authenticate scope={['identify', 'guilds']}>
 *  <Activity />
 * </DiscordContextProvider>
 * ```
 *
 * Learn more:
 * https://robojs.dev/discord-activities/authentication
 */
export default function App() {
    return (
        <DiscordContextProvider authenticate scope={['identify', 'guilds']}>
            <SyncContextProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/game" element={<Activity />} />
                    </Routes>
                </BrowserRouter>
            </SyncContextProvider>
        </DiscordContextProvider>
    );
}

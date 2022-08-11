import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import api from '../../services';

interface SiteManifest {
    generator: string[];
    transporter: string[];
    tsd: string[];
}

function SiteManifests() {
    let params = useParams();
    const [loading, setLoading] = useState(false);
    const [siteManifest, setSiteManifest] = useState<SiteManifest | undefined>(
        undefined
    );

    useEffect(() => {
        async function getSiteManifest(siteId: string) {
            const myData = await api.get(`trak/site/${siteId}/manifest`, null);
            setSiteManifest(myData);
        }

        setLoading(true);
        if (typeof params.siteId === 'string') {
            getSiteManifest(params.siteId);
        } else {
            setSiteManifest(undefined);
        }
        // api.get(`trak/site/${params.siteId}/manifest`, null).then((response) => {
        //   setSiteManifest(response);
        // });
    }, [params.siteId]);

    console.log(siteManifest);
    return <>{siteManifest ? <p>hello</p> : <p>no manifest</p>}</>;
}

export default SiteManifests;

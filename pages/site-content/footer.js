import React from "react";
import SiteContentSinglePage from "../../components/site-content/useSiteContentSingle";
import FooterEditor from "../../components/site-content/FooterEditor";

export default function SiteContentFooterPage() {
  return (
    <SiteContentSinglePage
      contentKey="footer"
      title="Footer"
      description="Link footer columns to CMS pages and other destinations"
    >
      {(data, setData) => (
        <FooterEditor
          columns={data.columns || []}
          onChange={(columns) => setData({ ...data, columns })}
        />
      )}
    </SiteContentSinglePage>
  );
}
